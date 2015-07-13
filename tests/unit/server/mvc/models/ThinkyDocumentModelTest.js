var ThinkyDocumentModel = require(__dirname + "/../../../../../server/mvc/models/ThinkyDocumentModel");
var assert = require('chai').assert;
var expect = require('chai').expect;
var Promise = require("bluebird");

var bogusConfig = {
    bogus: "cake"
  }
  , bogusThinky = require("thinky")({db: "bogus"});

describe("ThinkyDocumentModel", function(){
  before(function(){
    bogusThinky.r.tableDrop("ThinkyDocumentModel");
  });
  after(function(){
    bogusThinky.r.tableDrop("ThinkyDocumentModel");
  });
  beforeEach(function(){
    bogusThinky.r.tableCreate("ThinkyDocumentModel");
    ThinkyDocumentModel.init(bogusConfig, bogusThinky);
  });
  afterEach(function(){
    bogusThinky.r.tableDrop("ThinkyDocumentModel");
  });
  describe("getConfig()", function(){
    it("Should return input config", function(){
      var thinkyDocumentModel = new ThinkyDocumentModel;
      assert.typeOf(thinkyDocumentModel.getConfig(), "object");
      assert.deepEqual(thinkyDocumentModel.getConfig(), {bogus:"cake"});
    });
  });
  describe("getThinky()", function(){
    it("Should return input thinky", function(){
      var thinkyDocumentModel = new ThinkyDocumentModel;
      assert.typeOf(thinkyDocumentModel.getThinky(), "object");
      assert.deepEqual(thinkyDocumentModel.getThinky(), bogusThinky);
    });
  });
  describe("save()", function(){
    it("Should not save an invalid document", function(done){
      var thinkyDocumentModel = new ThinkyDocumentModel;
      thinkyDocumentModel
        .save()
        .error(function(err){
          expect(err).to.be.an.instanceOf(TypeError);
          assert.equal(err.toString(), "TypeError: Cannot read property 'validate' of undefined");
          done();
        });
    });
  });
});
