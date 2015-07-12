var assert = require('chai').assert;
var expect = require('chai').expect;
var Promise = require("bluebird");

var bogusConfig = {
    log: {
      access: {
        "a": "Just an Object with lots of data"
      }
    }
  }
  , bogusThinky = require("thinky")({db: "bogus"})
  , Models = {}
  , DocumentModel;

describe("DevExamples", function(){
  before(function(){
    bogusThinky.r.tableDrop("DevExamples");
    bogusThinky.r.tableCreate("DevExamples");
  });
  after(function(){
    bogusThinky.r.tableDrop("DevExamples");
  });
  beforeEach(function(){
    DocumentModel = require(__dirname + "/../../../../../server/mvc/models/DocumentModel.js");
    DocumentModel.init(bogusConfig, bogusThinky);
    Models.DevExamples = require(__dirname + "/../../../../../server/mvc/models/DevExamples.js");
  });
  afterEach(function(done){
    bogusThinky.r.table("DevExamples").delete().run().finally(function(){
      done();
    });
  });
  describe("whatIsOnePlusTwo", function(){
    it("Should be 3", function(){
      var devExamples = new Models.DevExamples;
      assert.strictEqual(devExamples.whatIsOnePlusTwo(), 3);
    });
  });
  describe("promiseMeEverythingWillBeAlright", function(){
    var devExamples;
    before(function(){
      devExamples = new Models.DevExamples;
    });
    it("Should return a promise", function(){
      expect(devExamples.promiseMeEverythingWillBeAlright()).to.be.an.instanceOf(Promise);
    });
    it("Should be alright", function(done){
      devExamples.promiseMeEverythingWillBeAlright().then(function(){
        done();
      });
    });
  });
  describe("getAccessLogConfigData", function(){
    it("Should return raw config data, i.e. no logic", function(){
      var devExamples = new Models.DevExamples;
      var expected = {
        "a": "Just an Object with lots of data"
      };
      assert.deepEqual(devExamples.getAccessLogConfigData(), expected, "Expects a deep Object");
    });
  });
  describe("saveInDatabaseAndReturnViaPromise", function(){
    var devExamples;
    before(function(){
      devExamples = new Models.DevExamples;
    });
    it("Should return a promise", function(){
      expect(devExamples.saveInDatabaseAndReturnViaPromise("cake")).to.be.an.instanceOf(Promise);
    });
    it("Should accept a String as value and return the document", function(done){
      devExamples.saveInDatabaseAndReturnViaPromise("cake").then(function(data){
        assert.typeOf(data, "object");
        assert.equal(data.someText, "cake");
        done();
      });
    });
    it("Gives validation error when argument is not a String", function(done){
      devExamples.saveInDatabaseAndReturnViaPromise(undefined).error(function(err){
        assert.typeOf(err, "object");
        assert.equal(err.toString(), "Document failed validation: Value for [someText] must be defined.");
        done();
      });
    });
  });
});
