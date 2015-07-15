var assert = require('chai').assert;
var expect = require('chai').expect;

var modelsPath = __dirname + "/../../../../../server/mvc/models"
  , DefaultModel = require(modelsPath + "/DefaultModel");

describe("DefaultModel", function(){
  it("Is instantiable", function(){
    var defaultModel = new DefaultModel;
    expect(defaultModel).to.be.an.instanceOf(DefaultModel);
  });
  describe("Human reabables", function(){
    var defaultModel = new DefaultModel;
    describe("getHumanReadableTypeAndValue()", function(){
      var testCases = [
        {"value": "abc",                              "expected": "(String) abc"},
        {"value": undefined,                          "expected": "undefined"},
        {"value": 1,                                  "expected": "(Number) 1"},
        {"value": 3.14,                               "expected": "(Number) 3.14"},
        {"value": null,                               "expected": "null"},
        {"value": [1,2,3],                            "expected": "(Array) [1,2,3]"},
        {"value": [1,2,3,4,5,6,7,8,9,10,11,12,13,14], "expected": "(Array) [1,2,3,4,5,6,7,8 ... ]"},
        {"value": {"a":"b"},                          "expected": "(Object) {\"a\":\"b\"}"},
        {"value": {"a":"b",2:{3:4},4:"g","23":[4,5]}, "expected": "(Object) {\"2\":{\"3\":4},\"4 ... }"}, // Javascript orders keys in Objects alphanumerically
      ];
      testCases.forEach(function(testCase){
        it("Human readable version works for: " + defaultModel.getHumanReadableTypeAndValue(testCase.value), function(){
          assert.deepEqual(defaultModel.getHumanReadableTypeAndValue(testCase.value), testCase.expected);
        });
      });
    });
  });
  describe("Validators", function(){
    var defaultModel = new DefaultModel;
    describe("validateIsArray()", function(){
      var testCases = [
        {"value": [],        "expected": true},
        {"value": [1,2,3],   "expected": true},
        {"value": null,      "expected": false},
        {"value": "abc",     "expected": false},
        {"value": undefined, "expected": false},
        {"value": 1,         "expected": false},
        {"value": 3.14,      "expected": false},
        {"value": {"a":"b"}, "expected": false},
      ];
      testCases.forEach(function(testCase){
        it("Will validate correctly for: " + defaultModel.getHumanReadableTypeAndValue(testCase.value), function(){
          assert.strictEqual(defaultModel.validateIsArray(testCase.value), testCase.expected);
        });
      });
    });
    describe("validateIsInteger()", function(){
      var testCases = [
        {"value": 1,         "expected": true},
        {"value": 999,       "expected": true},
        {"value": null,      "expected": false},
        {"value": "abc",     "expected": false},
        {"value": undefined, "expected": false},
        {"value": 3.14,      "expected": false},
        {"value": [1,2,3],   "expected": false},
        {"value": {"a":"b"}, "expected": false},
      ];
      testCases.forEach(function(testCase){
        it("Will validate correctly for: " + defaultModel.getHumanReadableTypeAndValue(testCase.value), function(){
          assert.strictEqual(defaultModel.validateIsInteger(testCase.value), testCase.expected);
        });
      });
    });
    describe("validateIsNull()", function(){
      var testCases = [
        {"value": null,      "expected": true},
        {"value": "abc",     "expected": false},
        {"value": undefined, "expected": false},
        {"value": 1,         "expected": false},
        {"value": 3.14,      "expected": false},
        {"value": [1,2,3],   "expected": false},
        {"value": {"a":"b"}, "expected": false},
      ];
      testCases.forEach(function(testCase){
        it("Will validate correctly for: " + defaultModel.getHumanReadableTypeAndValue(testCase.value), function(){
          assert.strictEqual(defaultModel.validateIsNull(testCase.value), testCase.expected);
        });
      });
    });
    describe("validateIsNumber()", function(){
      var testCases = [
        {"value": 1,         "expected": true},
        {"value": 3.14,      "expected": true},
        {"value": null,      "expected": false},
        {"value": "abc",     "expected": false},
        {"value": undefined, "expected": false},
        {"value": [1,2,3],   "expected": false},
        {"value": {"a":"b"}, "expected": false},
      ];
      testCases.forEach(function(testCase){
        it("Will validate correctly for: " + defaultModel.getHumanReadableTypeAndValue(testCase.value), function(){
          assert.strictEqual(defaultModel.validateIsNumber(testCase.value), testCase.expected);
        });
      });
    });
    describe("validateIsObject()", function(){
      var testCases = [
        {"value": {},        "expected": true},
        {"value": {"a":"b"}, "expected": true},
        {"value": [1,2,3],   "expected": true},
        {"value": 1,         "expected": false},
        {"value": 3.14,      "expected": false},
        {"value": null,      "expected": false},
        {"value": "abc",     "expected": false},
        {"value": undefined, "expected": false},
      ];
      testCases.forEach(function(testCase){
        it("Will validate correctly for: " + defaultModel.getHumanReadableTypeAndValue(testCase.value), function(){
          assert.deepEqual(defaultModel.validateIsObject(testCase.value), testCase.expected);
        });
      });
    });
    describe("validateIsString()", function(){
      var testCases = [
        {"value": "abc",     "expected": true},
        {"value": undefined, "expected": false},
        {"value": null,      "expected": false},
        {"value": 1,         "expected": false},
        {"value": 3.14,      "expected": false},
        {"value": [],        "expected": false},
        {"value": {},        "expected": false},
      ];
      testCases.forEach(function(testCase){
        it("Will validate correctly for: " + defaultModel.getHumanReadableTypeAndValue(testCase.value), function(){
          assert.strictEqual(defaultModel.validateIsString(testCase.value), testCase.expected);
        });
      });
    });
    describe("validateIsUndefined()", function(){
      var testCases = [
        {"value": undefined, "expected": true},
        {"value": "abc",     "expected": false},
        {"value": null,      "expected": false},
        {"value": 1,         "expected": false},
        {"value": 3.14,      "expected": false},
        {"value": [],        "expected": false},
        {"value": {},        "expected": false},
      ];
      testCases.forEach(function(testCase){
        it("Will validate correctly for: " + defaultModel.getHumanReadableTypeAndValue(testCase.value), function(){
          assert.strictEqual(defaultModel.validateIsUndefined(testCase.value), testCase.expected);
        });
      });
    });
  });
  describe("Guards", function(){
    var defaultModel = new DefaultModel;
    describe("guardIsArray()", function(){
      it("Will not fail and will return 'this' when value is a valid Array", function(){
        assert.deepEqual(defaultModel.guardIsArray([]), defaultModel);
      });
      it("Will throw TypeError when an invalid parameter is provided", function(){
        assert.throw(function(){defaultModel.guardIsInteger(undefined)}, TypeError);
        assert.throw(function(){defaultModel.guardIsInteger(null)}, TypeError);
      });
    });
    describe("guardIsInteger()", function(){
      it("Will not fail and will return 'this' when value is a valid Integer", function(){
        assert.deepEqual(defaultModel.guardIsInteger(1), defaultModel);
      });
      it("Will throw TypeError when an invalid parameter is provided", function(){
        assert.throw(function(){defaultModel.guardIsInteger(undefined)}, TypeError);
      });
    });
    describe("guardIsNull()", function(){
      it("Will not fail and will return 'this' when value is null", function(){
        assert.deepEqual(defaultModel.guardIsNull(null), defaultModel);
      });
      it("Will throw TypeError when an invalid parameter is provided", function(){
        assert.throw(function(){defaultModel.guardIsNull(undefined)}, TypeError);
      });
    });
    describe("guardIsNumber()", function(){
      it("Will not fail and will return 'this' when value is a valid Number", function(){
        assert.deepEqual(defaultModel.guardIsNumber(1), defaultModel);
        assert.deepEqual(defaultModel.guardIsNumber(1.2), defaultModel);
      });
      it("Will throw TypeError when an invalid parameter is provided", function(){
        assert.throw(function(){defaultModel.guardIsNumber(undefined)}, TypeError);
      });
    });
    describe("guardIsObject()", function(){
      it("Will not fail and will return 'this' when value is a valid Number", function(){
        assert.deepEqual(defaultModel.guardIsObject({}), defaultModel);
      });
      it("Will throw TypeError when an invalid parameter is provided", function(){
        assert.throw(function(){defaultModel.guardIsObject(undefined)}, TypeError);
        assert.throw(function(){defaultModel.guardIsObject(null)}, TypeError);
      });
    });
    describe("guardIsString()", function(){
      it("Will not fail and will return 'this' when value is a valid String", function(){
        assert.deepEqual(defaultModel.guardIsString("abc"), defaultModel);
      });
      it("Will throw TypeError when an invalid parameter is provided", function(){
        assert.throw(function(){defaultModel.guardIsString(1)}, TypeError);
      });
    });
    describe("guardIsUndefined()", function(){
      it("Will not fail and will return 'this' when value is undefined", function(){
        assert.deepEqual(defaultModel.guardIsUndefined(undefined), defaultModel);
      });
      it("Will throw TypeError when an invalid parameter is provided", function(){
        assert.throw(function(){defaultModel.guardIsUndefined(null)}, TypeError);
      });
    });
  });
});
