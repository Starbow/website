var assert = require('chai').assert;
var expect = require('chai').expect;

var modelsPath = __dirname + "/../../../../../server/mvc/models"
  , bogusConfig = {
    bogus: "cake"
  }
  , bogusThinky = require("thinky")({db: "bogus"})
  , ConfigModel = require(modelsPath + "/ConfigModel")
  , ThinkyDocumentModel = require(modelsPath + "/ThinkyDocumentModel");

describe("ThinkyDocumentModel", function(){
  before(function(){
    bogusThinky.r.tableDrop("ThinkyDocumentModel");
    ConfigModel.init(bogusConfig);
    ThinkyDocumentModel.init(bogusThinky);
  });
  after(function(){
    bogusThinky.r.tableDrop("ThinkyDocumentModel");
  });
  beforeEach(function(){
    bogusThinky.r.tableCreate("ThinkyDocumentModel");
  });
  afterEach(function(){
    bogusThinky.r.tableDrop("ThinkyDocumentModel");
  });
  it("Should inherit correctly", function(){
    var thinkyDocumentModel = new ThinkyDocumentModel;
    expect(thinkyDocumentModel).to.be.an.instanceOf(ConfigModel);
    expect(thinkyDocumentModel).to.be.an.instanceOf(ThinkyDocumentModel);
  });
  describe("getThinky()", function(){
    it("Should return input thinky", function(){
      assert.typeOf(ThinkyDocumentModel.getThinky(), "object");
      assert.deepEqual(ThinkyDocumentModel.getThinky(), bogusThinky);
    });
  });
  describe("save()", function(){
    it("Should not save an invalid document", function(done){
      var thinkyDocumentModel = new ThinkyDocumentModel(undefined);
      thinkyDocumentModel
        .save()
        .error(function(err){
          expect(err).to.be.an.instanceOf(TypeError);
          assert.equal(err.toString(), "TypeError: Cannot read property 'validate' of undefined");
          done();
        });
    });
    it("Should be able to save an valid document", function(done){
      var ThinkyModel = bogusThinky.createModel("ThinkyDocumentModel_807ade1f", {});
      var thinkyDocumentModel = new ThinkyDocumentModel(new ThinkyModel({}));
      thinkyDocumentModel
        .save()
        .then(done);
    });
  });
  describe("Values", function(){
    var ThinkyModel;
    var getThinkyModel = function(){
      if (ThinkyModel === undefined) {
        ThinkyModel = bogusThinky.createModel("ThinkyDocumentModel_eacd6576", {
          foo: bogusThinky.type.string().default(null).min(1).required().allowNull(false)
        });
      }
      return ThinkyModel;
    };
    describe("setValue()", function(){
      it("Cannot set value for invalid key", function(){
        var ThinkyModel = getThinkyModel();
        var thinkyDocumentModel = new ThinkyDocumentModel(new ThinkyModel({}));
        assert.throws(function(){thinkyDocumentModel.setValue("bar", "abc");}, Error);
      });
      it("Can set value for valid key", function(){
        var ThinkyModel = getThinkyModel();
        var thinkyDocumentModel = new ThinkyDocumentModel(new ThinkyModel({}));
        thinkyDocumentModel.setValue("foo", "abc");
      });
    });
    describe("setValues()", function(){
      it("Must receive a key-value paired Object", function(){
        var ThinkyModel = getThinkyModel();
        var thinkyDocumentModel = new ThinkyDocumentModel(new ThinkyModel({}));
        var notAnObject = "foo";
        assert.throws(function(){thinkyDocumentModel.setValues(notAnObject);}, Error);
      });
      it("Cannot set invalid value", function(){
        var ThinkyModel = getThinkyModel();
        var thinkyDocumentModel = new ThinkyDocumentModel(new ThinkyModel({}));
        assert.throws(function(){thinkyDocumentModel.setValues({"foo": 123});}, Error);
      });
      it("Can set value for valid key", function(){
        var ThinkyModel = getThinkyModel();
        var thinkyDocumentModel = new ThinkyDocumentModel(new ThinkyModel({}));
        thinkyDocumentModel.setValues({"foo": "abc"});
      });
    });
  });
});
