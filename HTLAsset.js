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

        return super.parse(this.contents);
    }

    addPreprocessor(name, fallback) {
        if (fs.existsSync(name)) {
            const relname =
                name.replace(/^.*\//g, "./");
            this.addDependency(relname);
        } else {
            try {
                if (require.resolve(fallback)) {
                    //console.log(name + " does not exist, adding default: " + require.resolve(fallback));
                    this.addDependency(fallback);
                }
            } catch (e) {
                console.log(e);
            }
        }
    }

    collectDependencies() {
        const rootname = this.name.replace(/\.[^.]+$/, "");
        const extension = this.basename
            .split(".")
            .slice(-2, -1)
            .pop();
        const selector = this.basename
            .split(".")
            .slice(0, -2)
            .join(".");

        this.addPreprocessor(`${rootname}.pipe.js`, `@adobe/hypertext-pipeline/src/defaults/${extension}.pipe.js`);
        this.addPreprocessor(`${rootname}.pre.js`, `@adobe/hypertext-pipeline/src/defaults/${extension}.pre.js`);

        super.collectDependencies();
    }
}

module.exports = HTLAsset;
