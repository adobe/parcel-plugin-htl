const Compiler = require("@adobe/htlengine/src/compiler/Compiler");

const JSAsset = require("parcel-bundler/src/assets/JSAsset");
const fs = require("fs");
const path = require("path");

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

        const rootname = this.name.replace(/\.[^.]+$/, "");
        const extension = this.basename
            .split(".")
            .slice(-2, -1)
            .pop();
        const selector = this.basename
            .split(".")
            .slice(0, -2)
            .join(".");

        const pipe = this.getPreprocessor(`${rootname}.pipe.js`, `@adobe/hypertext-pipeline/src/defaults/${extension}.pipe.js`);
        const pre  = this.getPreprocessor(`${rootname}.pre.js` , `@adobe/hypertext-pipeline/src/defaults/${extension}.pre.js`);
    
            
        //return super.parse(this.contents);
        const body = `
            ${this.contents}

            const { pipe } = require('${pipe}');
            const main = module.exports.main;
            const { pre } = require('${pre}');
            //this gets called by openwhisk
            module.exports.main = pipe(pre(main));
        `;
        return super.parse(body);
    }

    getPreprocessor(name, fallback) {
        if (fs.existsSync(name)) {
            const relname =
                name.replace(/^.*\//g, "./");
            return relname;
        } else {
            try {
                if (require.resolve(fallback)) {
                    return fallback;
                }
            } catch (e) {
                //console.log(e);
            }
        }
        return '@adobe/hypertext-pipeline/src/defaults/default.js';
    }
}

module.exports = HTLAsset;
