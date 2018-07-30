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

class HTLPreAsset extends HTMLAsset {
  constructor(name, options) {
    super(name, options);
    this.type = 'htl-processed';
  }

  addURLDependency(url, from = this.name, opts) {
    // we only support relative addressed dependencies. parcel would try to resolve those
    if (url && (url[0] === '/' || url[0] === '$')) {
      return url;
    }
    return super.addURLDependency(url, from, opts);
  }

  async postProcess(generated) {
    const v = await super.postProcess(generated);
    v[0].type = 'htl-processed';
    return v;
  }

  generateBundleName() {
    // use 'js' as extension in order to generate correct file name
    const b = super.generateBundleName();
    return `${b}.js`;
  }
}

module.exports = HTLPreAsset;
