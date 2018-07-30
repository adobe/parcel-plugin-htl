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

const Asset = require('parcel-bundler/src/Asset');
const fs = require('fs');
const path = require('path');
const logger = require('parcel-bundler/src/Logger');
const resolver = require('./resolver');

const DEFAULT_PIPELINE = '@adobe/hypermedia-pipeline/src/defaults/default.js';

class HTLAsset extends Asset {
  constructor(name, options) {
    super(name, options);
    this.type = 'js';
  }

  async generate() {
    const compiler = new Compiler()
      .withOutputDirectory('')
      .includeRuntime(true)
      .withRuntimeGlobalName('it');

    const code = compiler.compileToString(this.contents);
    const rootname = this.name.replace(/\.[^.]+$/, '');
    const extension = resolver.extension(this.basename);

    const pipe = this.getPreprocessor(
      `${rootname}.pipe.js`,
      `@adobe/hypermedia-pipeline/src/defaults/${extension}.pipe.js`,
    );
    const pre = this.getPreprocessor(
      `${rootname}.pre.js`,
      `@adobe/hypermedia-pipeline/src/defaults/${extension}.pre.js`,
    );

    let body = fs.readFileSync(path.join(__dirname, 'OutputTemplate.js'), 'utf-8');
    body = body.replace(/^\s*\/\/\s*CONTENTS\s*$/m, `\n${code}`);
    body = body.replace(/MOD_PIPE/, pipe);
    body = body.replace(/MOD_PRE/, pre);
    return [{
      type: 'js',
      value: body,
    }];
  }

  getPreprocessor(name, fallback) {
    if (fs.existsSync(name)) {
      const relname = path.relative(this.name, name).substr(1);
      return relname;
    }
    try {
      if (require.resolve(fallback)) {
        return fallback;
      }
    } catch (e) {
      logger.log(`${fallback} cannot be found, using default pipeline`);
    }

    return DEFAULT_PIPELINE;
  }

}

module.exports = HTLAsset;
