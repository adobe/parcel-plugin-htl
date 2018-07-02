const assert = require('assert');
const $ = require('shelljs');
const winston = require('winston');

describe('Test generated functions', () =>{
  const params = {
    path: '/hello.md',
    __ow_method: 'get',
    owner: 'trieloff',
    SECRET: '🎶 agent man',
    __ow_headers: {
      'X-Forwarded-Port': '443',
      'X-CDN-Request-Id': '2a208a89-e071-44cf-aee9-220880da4c1e',
      'Fastly-Client': '1',
      'X-Forwarded-Host': 'runtime.adobe.io',
      'Upgrade-Insecure-Requests': '1',
      Host: 'controller-a',
      Connection: 'close',
      'Fastly-SSL': '1',
      'X-Request-Id': 'RUss5tPdgOfw74a68aNc24FeTipGpVfW',
      'X-Branch': 'master',
      'Accept-Language': 'en-US, en;q=0.9, de;q=0.8',
      'X-Forwarded-Proto': 'https',
      'Fastly-Orig-Accept-Encoding': 'gzip',
      'X-Varnish': '267021320',
      DNT: '1',
      'X-Forwarded-For':
            '192.147.117.11, 157.52.92.27, 23.235.46.33, 10.64.221.107',
      'X-Host': 'www.primordialsoup.life',
      Accept:
            'text/html, application/xhtml+xml, application/xml;q=0.9, image/webp, image/apng, */*;q=0.8',
      'X-Real-IP': '10.64.221.107',
      'X-Forwarded-Server': 'cache-lcy19249-LCY, cache-iad2127-IAD',
      'Fastly-Client-IP': '192.147.117.11',
      'Perf-Br-Req-In': '1529585370.116',
      'X-Timer': 'S1529585370.068237,VS0,VS0',
      'Fastly-FF':
            'dc/x3e9z8KMmlHLQr8BEvVMmTcpl3y2YY5y6gjSJa3g=!LCY!cache-lcy19249-LCY, dc/x3e9z8KMmlHLQr8BEvVMmTcpl3y2YY5y6gjSJa3g=!LCY!cache-lcy19227-LCY, dc/x3e9z8KMmlHLQr8BEvVMmTcpl3y2YY5y6gjSJa3g=!IAD!cache-iad2127-IAD, dc/x3e9z8KMmlHLQr8BEvVMmTcpl3y2YY5y6gjSJa3g=!IAD!cache-iad2133-IAD',
      'Accept-Encoding': 'gzip',
      'User-Agent':
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.87 Safari/537.36',
    },
    repo: 'soupdemo',
    ref: 'master',
    selector: 'md',
    branch: 'master',
  };

  it('Project can be built', () => {
    $.cd('test/integration');
    const code = $.exec('npm run build', {silent: true});
    $.cd('../..');
    assert.ok(code);
  }).timeout(25000);;

  it('Result can be loaded', (done) => {
    $.cd('test/integration');
    const code = $.exec('npm run build', {silent: true});
    const html = require('../integration/dist/html');
    $.cd('../..');
    assert.ok(html);
    assert.ok(html.main);
    html.main(params, {SECRETS: 'there'}).then(r => {
      assert.ok(r.body.indexOf('>'));
      done();
    });
  }).timeout(25000);


  it('Secrets and loggers are honored', (done) => {
    $.cd('test/integration');
    const code = $.exec('npm run build', {silent: true});
    const html = require('../integration/dist/html');

    let counter = 0;
    const mylogger = winston.createLogger({
      level: 'silly',
      format: winston.format.printf(info => {
        if (counter==0) {
          // that's our validation that the custom log configuration gets picked up
          done();
        }
        counter = counter + 1;
        return counter + ' ' + info.level + ' ' + info.message;
      }),
      transports: new winston.transports.Console()
    });

    $.cd('../..');
    assert.ok(html);
    assert.ok(html.main);
    html.main(params, {SECRETS: 'there'}, mylogger).then(r => {
      assert.ok(r.body.indexOf('>'));
    });
  }).timeout(25000);
});