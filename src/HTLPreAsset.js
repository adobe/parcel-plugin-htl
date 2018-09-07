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
const HTMLAsset = require('parcel-bundler/src/assets/HTMLAsset');

function isVariable(path) {
  return (path[0] === '$');
}

/**
 * Parcel asset that pre-processes the HTL like HTML and rewrites static links.
 */
class HTLPreAsset extends HTMLAsset {
  constructor(name, options) {
    super(name, options);
    this.type = 'js';
  }

  addURLDependency(url, from = this.name, opts) {
    // we only support relative addressed dependencies. parcel would try to resolve those
    if (url && (url[0] === '/' || url[0] === '$')) {
      return url;
    }
    return super.addURLDependency(url, from, opts);
  }

  processSingleDependency(path, opts) {
    if (isVariable(path)) {
      return path;
    }
    return super.processSingleDependency(path, opts);
  }

  async generate() {
    // we post-process already here, so we can cascade the JS processing
    const generated = await super.generate();
    let processed = await super.postProcess(generated);
    // change type to delegate to 2nd plugin
    if (typeof processed === 'string') {
      processed = [{
        value: processed,
      }];
    }
    processed[0].type = 'htl-preprocessed';
    return processed;
  }

  // eslint-disable-next-line class-methods-use-this
  async postProcess(generated) {
    // ignore post processing of super class
    return generated;
  }
}

module.exports = HTLPreAsset;
