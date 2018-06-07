const { Asset } = require("parcel-bundler");
const htl = require("htlengine");
const Compiler = require("htlengine/src/compiler/Compiler");
const TemplateParser = require('htlengine/src/parser/html/TemplateParser');
const ThrowingErrorListener = require('htlengine/src/parser/htl/ThrowingErrorListener');
const JSCodeGenVisitor = require('htlengine/src/compiler/JSCodeGenVisitor');

const DEFAULT_TEMPLATE = './node_modules/htlengine/src/compiler/JSCodeTemplate.js';
const RUNTIME_TEMPLATE = './node_modules/htlengine/src/compiler/JSRuntimeTemplate.js';


const JSAsset = require('parcel-bundler/src/assets/JSAsset');
const fs = require("fs");
const path = require('path');

/*
 * Overriding the compile method so that it does not spit out files 
 */
class TransientCompiler extends Compiler {
  compile(source, name) {
    // todo: async support
    const commands = new TemplateParser()
        .withErrorListener(ThrowingErrorListener.INSTANCE)
        .parse(source);

    const global = [];
    this._runtimeGlobals.forEach(g => {
        global.push(`        let ${g} = runtime.globals.${g};\n`);
    });
    if (this._runtimeGlobal) {
        global.push(`        const ${this._runtimeGlobal} = runtime.globals;\n`);
    }

    const code = new JSCodeGenVisitor()
        .withIndent('    ')
        .indent()
        .process(commands)
        .code;

    const codeTemplate = this._includeRuntime ? RUNTIME_TEMPLATE : DEFAULT_TEMPLATE;
    let template = fs.readFileSync(path.join(__dirname, codeTemplate), 'utf-8');
    template = template.replace(/^\s*\/\/\s*RUNTIME_GLOBALS\s*$/m, global.join(''));
    template = template.replace(/^\s*\/\/\s*CODE\s*$/m, code);
    // try to use local references for HTL Engine, so that parcel will pick it up
    //template = template.replace(/htlengine\/src\/runtime\/Runtime/, '../node_modules/htlengine/src/runtime/Runtime');

    return template;
}
}

class HTLAsset extends JSAsset {
  constructor(name, pkg, options) {
    super(name, pkg, options);
    this.type = "js";
  }

  async parse(code) {
    //TODO
    const compiler = new TransientCompiler()
      .withOutputDirectory("")
      .includeRuntime(true)
      .withRuntimeGlobalName("it");

    this.contents = compiler.compile(code);

    return super.parse(this.contents);
  }
}

module.exports = HTLAsset;
