const Compiler = require("@adobe/htlengine/src/compiler/Compiler");

const JSAsset = require('parcel-bundler/src/assets/JSAsset');
const fs = require("fs");
const path = require('path');

class HTLAsset extends JSAsset {
  constructor(name, options) {
    super(name, options);
    this.type = "js";
  }

  async parse(code) {
    //TODO
    const compiler = new Compiler()
      .withOutputDirectory("")
      .includeRuntime(true)
      .withRuntimeGlobalName("it");

    this.contents = compiler.compileToString(code);

    return super.parse(this.contents);
  }
}

module.exports = HTLAsset;
