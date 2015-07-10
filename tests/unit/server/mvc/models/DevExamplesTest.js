var assert = require("assert");
var Promise = require("bluebird");

var DevExamples;
var bogusConfig = {
    log: {
      access: {
        "a": "Just an Object with lots of data"
      }
    }
  };
var bogusThinky = require("thinky")({db: "bogus"});

describe("DevExamples", function(){
  before(function(){
    bogusThinky.r.db("bogus").tableDrop("DevExamples");
    bogusThinky.r.db("bogus").tableCreate("DevExamples");
  });
  after(function(){
    bogusThinky.r.db("bogus").tableDrop("DevExamples");
  });
  beforeEach(function(){
    DevExamples = require(__dirname + "/../../../../../server/mvc/models/DevExamples.js");
    var bogusThinky = require("thinky")({db: "bogus"});
    DevExamples.init(bogusConfig, bogusThinky);
  });
  afterEach(function(done){
    bogusThinky.r.table("DevExamples").delete().run().finally(function(){
      done();
    });
  });
  describe("whatIsOnePlusTwo", function(){
    it("Should be 3", function(){
      var devExamples = new DevExamples;
      assert.strictEqual(devExamples.whatIsOnePlusTwo(), 3);
    });
  });
  describe("promiseMeEverythingWillBeAlright", function(){
    var devExamples;
    before(function(){
      devExamples = new DevExamples;
    });
    it("Should return a promise", function(){
      assert.ok(devExamples.promiseMeEverythingWillBeAlright() instanceof Promise);
    });
    it("Should be alright", function(done){
      devExamples.promiseMeEverythingWillBeAlright().then(function(){
        done();
      });
    });
  });
  describe("getAccessLogConfigData", function(){
    it("Should return raw config data, i.e. no logic", function(){
      var devExamples = new DevExamples;
      var expected = {
        "a": "Just an Object with lots of data"
      };
      assert.deepEqual(devExamples.getAccessLogConfigData(), expected, "Expects a deep Object");
    });
  });
  describe("saveInDatabaseAndReturnViaPromise", function(){
    var devExamples;
    before(function(){
      devExamples = new DevExamples;
    });
    it("Should return a promise", function(){
      assert.ok(devExamples.saveInDatabaseAndReturnViaPromise("cake") instanceof Promise);
    });
    it("Should accept a String as value and return the document", function(done){
      devExamples.saveInDatabaseAndReturnViaPromise("cake").then(function(data){
        assert.equal(typeof(data), "object");
        assert.equal(data.someText, "cake");
        done();
      });
    });
    it("Gives validation error when argument is not a String", function(done){
      devExamples.saveInDatabaseAndReturnViaPromise(undefined).error(function(err){
        assert.equal(typeof(err), "object");
        assert.equal(err.toString(), "Document failed validation: Value for [someText] must be defined.");
        done();
      });
    });
  });
});
