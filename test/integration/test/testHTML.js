const assert = require("assert");

describe("Testing html.htl Pipeline", () => {
    const script = require("../dist/html.js");
    
    it("Script can be required", () => {
      assert.ok(script);
    });
});