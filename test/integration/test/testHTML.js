const assert = require("assert");

describe("Testing html.htl Pipeline", () => {
    const params = {};

    const script = require("../dist/html.js");

    it("Script can be required", () => {
        assert.ok(script);
    });

    it("Script has main function", () => {
        assert.ok(script.main);
        assert.equal(typeof script.main, "function");
    });

    it("Script can be executed", (done) => {
        const result = script.main(params);
        assert.ok(result);
        result.then((res) => {
            assert.ok(res);
            console.log(res);
            done();
        });
    });

    
});
