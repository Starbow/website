var assert = require('chai').assert;
var expect = require('chai').expect;
var Promise = require("bluebird");

var modelsPath = __dirname + "/../../../../../server/mvc/models"
  , configMock = require("../../../../mocks/server/config/configMock")
  , logMock = require("../../../../mocks/server/mvc/logMock")
  , thinky = require("thinky")(configMock.db.thinky)
  , DefaultModel = require(modelsPath + "/DefaultModel")
  , UtilityModel = require(modelsPath + "/UtilityModel")
  , ThinkyDocumentModel = require(modelsPath + "/ThinkyDocumentModel")
  , DevExamples;

describe("DevExamples", function(){
  before(function(done){
    var callback = function(){
      UtilityModel.injectDependencies(configMock, logMock);
      ThinkyDocumentModel.injectDependencies(thinky);
      done();
    };
    thinky.r.tableList().run().then(function(tables){
      if (tables.indexOf("DevExamples") <= -1) {
        thinky.r.tableCreate("DevExamples").run().then(function(){
          callback();
        });
      } else {
        callback();
      }
    });
  });
  after(function(done){
    thinky.r.table("DevExamples").delete().run().then(function(){
      done();
    });
  });

  describe("Static", function(){

  });
  describe("Instances (i.e.: new DevExamples)", function(){
    beforeEach(function(done){
      thinky.r.table("DevExamples").delete().run().then(function(){
        DevExamples = require(modelsPath + "/DevExamples");
        done();
      });
    });

    it("Is instantiable", function(){
      var devExamples = new DevExamples;
      assert.typeOf(devExamples, "object");
      expect(devExamples).to.be.an.instanceOf(DevExamples);
    });
    it("Should inherit correctly", function(){
      var devExamples = new DevExamples;
      expect(devExamples).to.be.an.instanceOf(DefaultModel);
      expect(devExamples).to.be.an.instanceOf(UtilityModel);
      expect(devExamples).to.be.an.instanceOf(ThinkyDocumentModel);
      expect(devExamples).to.be.an.instanceOf(DevExamples);
    });
    describe("whatIsOnePlusTwo()", function(){
      it("Should be 3", function(){
        var devExamples = new DevExamples;
        assert.strictEqual(devExamples.whatIsOnePlusTwo(), 3);
      });
    });
    describe("promiseMeEverythingWillBeAlright()", function(){
      var devExamples;
      before(function(){
        devExamples = new DevExamples;
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
    describe("getAccessLogConfigData()", function(){
      it("Should return raw config data, i.e. no logic", function(){
        var devExamples = new DevExamples;
        var expected = {
          "format": "short",
          "options": {
            "stream": "access.log"
          }
        };
        assert.deepEqual(devExamples.getAccessLogConfigData(), expected, "Expects a deep Object");
      });
    });
    describe("saveInDatabaseAndReturnViaPromise()", function(){
      var devExamples;
      before(function(){
        devExamples = new DevExamples;
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
});
