const assert = require("assert");
const hasElementCorrectType = require("../dist/utils/hasElementCorrectType.js").hasElementCorrectType;

describe("Utils check", function() {
  describe("hasElementCorrectType", function() {
    it("should return true when the value is string", function() {
      assert.equal(hasElementCorrectType(""), true);
      assert.equal(hasElementCorrectType("app"), true);
      assert.equal(hasElementCorrectType("#app"), true);
      assert.equal(hasElementCorrectType(".app"), true);
      assert.equal(hasElementCorrectType("@app"), true);
    });
    it("should return true when the value is DOM object", function() {
      assert.equal(hasElementCorrectType({tagName: "BODY", nodeType: 1}), true);
    });
    it("should return false when the value is array", function() {
      assert.equal(hasElementCorrectType([]), false);
    });
    it("should return false when the value is object", function() {
      assert.equal(hasElementCorrectType({}), false);
    });
    it("should return false when the value is constructor", function() {
      assert.equal(hasElementCorrectType(new Object), false);
    });
  });
});