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

const BUNDLER_OPTIONS = {
  outDir: path.resolve(__dirname, '../example/dist'), // The out directory to put the build files in, defaults to dist
  watch: false, // whether to watch the files and rebuild them on change, defaults to
  // process.env.NODE_ENV !== 'production'
  cache: false, // Enabled or disables caching, defaults to true
  minify: false, // Minify files, enabled if process.env.NODE_ENV === 'production'
  target: 'node', // browser/node/electron, defaults to browser
  https: false, // Serve files over https or http, defaults to false
  logLevel: 1, // 3 = log everything, 2 = log warnings & errors, 1 = log errors
  sourceMaps: true, // Enable or disable sourcemaps, defaults to enabled (not supported in
  // minified builds yet)
  detailedReport: false, // Prints a detailed report of the bundles, assets, filesizes and times,
  // defaults to false, reports are only printed if watch is disabled
  rootDir: path.resolve(__dirname, '../example'),
  killWorkers: true,
};

const TEST_SCRIPTS = [
  'html',
];

describe('Generated Code Tests', () => {
  TEST_SCRIPTS.forEach((testScript) => {
    const DIST_HTML_JS = path.resolve(__dirname, `../example/dist/${testScript}.js`);
    const DIST_HTML_HTL = path.resolve(__dirname, `../example/dist/${testScript}.htl`);

    describe(`Testing ${testScript}`, () => {
      before(`Run Parcel programmatically on ${testScript}.htl`, async () => {
        await fs.remove(path.resolve(__dirname, '../example/dist'));
        const bundler = new Bundler(path.resolve(__dirname, `../example/${testScript}.htl`), BUNDLER_OPTIONS);
        bundler.addAssetType('htl', require.resolve('../../src/HTLAsset.js'));
        bundler.addAssetType('helix-js', require.resolve('./HelixJSAsset.js'));
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
        const res = await script.main({
          resource: {
            title: 'bar',
          },
        });
        assert.ok(res, 'no response received');
        assert.ok(res.body, 'response has no body');
        assert.ok(res.body.match(/Hello, world/), 'response body does not contain expected result');
        assert.ok(res.body.match(/this is a bar/), 'response body does not contain expected result from pre.js');
      });
    });
  });
});
