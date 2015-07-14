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
    describe("getHumanReadableTypeAndValue", function(){
      var testCasesNonObject = [
        {"value": "abc",     "expected": "(String) abc"},
        {"value": undefined, "expected": "undefined"},
        {"value": 1,         "expected": "(Number) 1"},
        {"value": 3.14,      "expected": "(Number) 3.14"},
      ];
      testCasesNonObject.forEach(function(testCase){
        var defaultModel = new DefaultModel;
        it("[Non-Object] Human readable version works for: " + defaultModel.getHumanReadableTypeAndValue(testCase.value), function(){
          assert.equal(defaultModel.getHumanReadableTypeAndValue(testCase.value), testCase.expected);
        });
      });
      var testCasesObject = [
        {"value": null,                               "expected": "null"},
        {"value": [1,2,3],                            "expected": "(Array) [1,2,3]"},
        {"value": [1,2,3,4,5,6,7,8,9,10,11,12,13,14], "expected": "(Array) [1,2,3,4,5,6,7,8 ... ]"},
        {"value": {"a":"b"},                          "expected": "(Object) {\"a\":\"b\"}"},
        {"value": {"a":"b",2:{3:4},4:"g","23":[4,5]}, "expected": "(Object) {\"2\":{\"3\":4},\"4 ... }"}, // Javascript orders keys in Objects alphanumerically
      ];
      testCasesObject.forEach(function(testCase){
        var defaultModel = new DefaultModel;
        it("[Object] Human readable version works for: " + defaultModel.getHumanReadableTypeAndValue(testCase.value), function(){
          assert.deepEqual(defaultModel.getHumanReadableTypeAndValue(testCase.value), testCase.expected);
        });
      });
    });
  });
  describe("Validators", function(){
    describe("isNull()", function(){
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
        var defaultModel = new DefaultModel;
        it("Will validate correctly for: " + defaultModel.getHumanReadableTypeAndValue(testCase.value), function(){
          assert.strictEqual(defaultModel.isNull(testCase.value), testCase.expected);
        });
      });
    });
    describe("isString()", function(){
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
        it("Will validate correctly for value '"+testCase.value+"' ("+typeof(testCase.value)+")", function(){
          var defaultModel = new DefaultModel;
          assert.strictEqual(defaultModel.isString(testCase.value), testCase.expected);
        });
      });
    });
  });
  describe("Guards", function(){
    describe("guardIsString", function(){
      it("Will not fail and will return 'this' when value is a valid String", function(){
        var defaultModel = new DefaultModel;
        assert.deepEqual(defaultModel.guardIsString("abc"), defaultModel);
      });
      it("Will throw TypeError when an invalid parameter is provided", function(){
        var defaultModel = new DefaultModel;
        assert.throw(function(){defaultModel.guardIsString(1)}, TypeError);
      });
    });
  });
});
