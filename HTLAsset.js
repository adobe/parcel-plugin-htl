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

const pipeline = require('@adobe/hypermedia-pipeline');

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

    const pipe = this.getPreprocessor(`${rootname}.pipe.js`, `@adobe/hypermedia-pipeline/src/defaults/${extension}.pipe.js`);
    const pre = this.getPreprocessor(`${rootname}.pre.js`, `@adobe/hypermedia-pipeline/src/defaults/${extension}.pre.js`);


    // return super.parse(this.contents);
    const body = `
            ${this.contents}

            const { pipe } = require('${pipe}');
            const main = module.exports.main;
            const { pre } = require('${pre}');
            //this gets called by openwhisk
            module.exports.main = pipe(pre(function(args) {
                return main(args).then(result => {
                    return { response: result };
                });
            }));
        `;
    return super.parse(body);
  }

  getPreprocessor(name, fallback) {
    if (fs.existsSync(name)) {
      const relname =
                name.replace(/^.*\//g, './');
      return relname;
    }
    try {
      if (require.resolve(fallback)) {
        console.log(fallback);
        return fallback;
      }
    } catch (e) {}

    return '@adobe/hypermedia-pipeline/src/defaults/default.js';
  }
}

module.exports = HTLAsset;
