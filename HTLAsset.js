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
const Compiler = require('@adobe/htlengine/src/compiler/Compiler');

const JSAsset = require('parcel-bundler/src/assets/JSAsset');
const fs = require('fs');
const path = require('path');

const DEFAULT_PIPELINE = '@adobe/hypermedia-pipeline/src/defaults/default.js';

class HTLAsset extends JSAsset {
  constructor(name, options) {
    super(name, options);
    this.type = 'js';
  }

  async parse(code) {
    // TODO
    const compiler = new Compiler()
      .withOutputDirectory('')
      .includeRuntime(true)
      .withRuntimeGlobalName('it');

    this.contents = compiler.compileToString(code);

    const rootname = this.name.replace(/\.[^.]+$/, '');
    const extension = this.basename
      .split('.')
      .slice(-2, -1)
      .pop();
    const selector = this.basename
      .split('.')
      .slice(0, -2)
      .join('.');

    const pipe = this.getPreprocessor(
      `${rootname}.pipe.js`,
      `@adobe/hypermedia-pipeline/src/defaults/${extension}.pipe.js`,
      selector,
    );
    const pre = this.getPreprocessor(
      `${rootname}.pre.js`,
      `@adobe/hypermedia-pipeline/src/defaults/${extension}.pre.js`,
      selector,
    );

    // return super.parse(this.contents);
    const body = `
            ${this.contents}

            const { pipe } = require('${pipe}');
            const main = module.exports.main;
            const { pre } = require('${pre}');
            const wrap = require('@adobe/openwhisk-loggly-wrapper');
            //this gets called by openwhisk

            function getbody(params, secrets, logger) {
              return main(params, secrets, logger).then(resobj => {
                // htlengine puts the formatted html into the body property of the
                // returned object, but the hypermedia pipeline expects it to be
                // in the response.body object
                return { response: resobj};
              })
              .catch(error => {
                console.error('Whaaa?', error);
              });
            }

            module.exports.main = (...args) => wrap(pipe(pre(getbody)), ...args);
        `;
    return super.parse(body);
  }

  getPreprocessor(name, fallback) {
    if (fs.existsSync(name)) {
      console.log('What is the relative path? ', name, this.name);
      console.log('\n');
      const relname = path.relative(this.name, name).substr(1);
      return relname;
    }
    try {
      if (require.resolve(fallback)) {
        return fallback;
      }
    } catch (e) {
      return DEFAULT_PIPELINE;
    }

    return DEFAULT_PIPELINE;
  }
}

module.exports = HTLAsset;
