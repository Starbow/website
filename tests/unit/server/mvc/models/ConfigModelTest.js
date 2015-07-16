var assert = require('chai').assert;
var expect = require('chai').expect;

var modelsPath = __dirname + "/../../../../../server/mvc/models"
  , bogusConfig = {
    bogus: "cake"
  }
  , DefaultModel = require(modelsPath + "/DefaultModel")
  , ConfigModel = require(modelsPath + "/ConfigModel");

describe("ConfigModel", function(){
  before(function(){
    ConfigModel.init(bogusConfig);
  });
  describe("Static", function(){
    describe("getConfig()", function(){
      it("Will return the same config data it received on 'init'", function(){
        assert.typeOf(ConfigModel.getConfig(), "object");
        assert.deepEqual(ConfigModel.getConfig(), {bogus:"cake"});
      });
    });
  });
  describe("Instances (i.e.: new ConfigModel)", function(){
    it("Is instantiable", function(){
      var configModel = new ConfigModel;
      assert.typeOf(configModel, "object");
      expect(configModel).to.be.an.instanceOf(ConfigModel);
    });
    it("Should inherit correctly", function(){
      var configModel = new ConfigModel;
      expect(configModel).to.be.an.instanceOf(DefaultModel);
      expect(configModel).to.be.an.instanceOf(ConfigModel);
    });
    describe("getConfig()", function(){
      it("Will return the same config as the static 'getConfig'", function(){
        var configModel = new ConfigModel;
        var staticConfig = ConfigModel.getConfig();
        assert.deepEqual(configModel.getConfig(), staticConfig);
      });
    });
  });
});
