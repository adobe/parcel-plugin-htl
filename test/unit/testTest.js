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

/* eslint-env node, mocha */

const assert = require('assert');
const Bundler = require('parcel-bundler');
const fs = require('fs-extra');
const { options } = require('./testBase');


describe('test.htl', () => {
  before('Run Parcel programmatically on test.htl', (done) => {
    const bundler = new Bundler('./test/example/test.htl', options);
    bundler.bundle().then(() => done());
  });

  it('correct output files have been generated', () => {
    assert.ok(fs.existsSync('./dist/test.js'), 'output file has been generated');
    assert.ok(!fs.existsSync('./dist/test.htl'), 'input file has been passed through');
  });
});
