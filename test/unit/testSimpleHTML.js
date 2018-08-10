/*
 * Copyright 2018 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */
/* eslint-env mocha */
const assert = require('assert');
const Bundler = require('parcel-bundler');
const fs = require('fs-extra');
const path = require('path');
const { options, logger } = require('./testBase');

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

const TEST_SCRIPTS = [
  'async_html',
  'return_async_html',
  'promise_html',
  'return_promise_html',
  'require_html',
  'simple_html',
  'return_simple_html',
];

describe('Simple Tests', () => {
  TEST_SCRIPTS.forEach((testScript) => {
    const DIST_HTML_JS = path.resolve(__dirname, `../example/dist/${testScript}.js`);
    const DIST_HTML_HTL = path.resolve(__dirname, `../example/dist/${testScript}.htl`);

    describe(`Testing ${testScript}`, () => {
      beforeEach(`Run Parcel programmatically on ${testScript}.htl`, async () => {
        await fs.remove(path.resolve(__dirname, '../example/dist'));
        const bundler = new Bundler(path.resolve(__dirname, `../example/${testScript}.htl`), options);
        bundler.addAssetType('htl', require.resolve('../../src/HTLAsset.js'));
        await bundler.bundle();
        delete require.cache[require.resolve(DIST_HTML_JS)];
      });

      it('correct output files have been generated', () => {
        assert.ok(fs.existsSync(DIST_HTML_JS), 'output file has been generated');
        assert.ok(!fs.existsSync(DIST_HTML_HTL), 'input file has been passed through');
      });

      it('script can be required', () => {
        // eslint-disable-next-line import/no-dynamic-require,global-require
        const script = require(DIST_HTML_JS);
        assert.ok(script);
      });

      it('script has main function', () => {
        // eslint-disable-next-line import/no-dynamic-require,global-require
        const script = require(DIST_HTML_JS);
        assert.ok(script.main);
        assert.equal(typeof script.main, 'function');
      });

      it('script can be executed', async () => {
        // eslint-disable-next-line import/no-dynamic-require,global-require
        const script = require(DIST_HTML_JS);
        const res = await script.main(params, { PSSST: 'secret' }, logger);
        assert.ok(res, 'no response received');
        assert.ok(res.body, 'response has no body');
        assert.ok(res.body.match(/Hello, world/), 'response body does not contain expected result');
        assert.ok(res.body.match(/this is a bar/), 'response body does not contain expected result from pre.js');
      });
    });
  });
});
