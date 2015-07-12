var DocumentModel = require(__dirname + "/../../../../../server/mvc/models/DocumentModel.js");
var assert = require('chai').assert;
var expect = require('chai').expect;
var Promise = require("bluebird");

var bogusConfig = {
    bogus: "cake"
  }
  , bogusThinky = require("thinky")({db: "bogus"});

describe("DocumentModel", function(){
  before(function(){
    bogusThinky.r.tableDrop("DocumentModel");
  });
  after(function(){
    bogusThinky.r.tableDrop("DocumentModel");
  });
  beforeEach(function(){
    bogusThinky.r.tableCreate("DocumentModel");
    DocumentModel.init(bogusConfig, bogusThinky);
  });
  afterEach(function(){
    bogusThinky.r.tableDrop("DocumentModel");
  });
  describe("getConfig()", function(){
    it("Should return input config", function(){
      var documentModel = new DocumentModel;
      assert.typeOf(documentModel.getConfig(), "object");
      assert.deepEqual(documentModel.getConfig(), {bogus:"cake"});
    });
  });
  describe("getThinky()", function(){
    it("Should return input thinky", function(){
      var documentModel = new DocumentModel;
      assert.typeOf(documentModel.getThinky(), "object");
      assert.deepEqual(documentModel.getThinky(), bogusThinky);
    });
  });
  describe("save()", function(){
    it("Should not save an invalid document", function(done){
      var documentModel = new DocumentModel;
      documentModel
        .save()
        .error(function(err){
          expect(err).to.be.an.instanceOf(TypeError);
          assert.equal(err.toString(), "TypeError: Cannot read property 'validate' of undefined");
          done();
        });
    });
  });
});
