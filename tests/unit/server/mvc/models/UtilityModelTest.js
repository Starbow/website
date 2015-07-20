var assert = require('chai').assert;
var expect = require('chai').expect;

var modelsPath = __dirname + "/../../../../../server/mvc/models"
  , configMock = require("../../../../mocks/server/config/configMock")
  , logMock = require("../../../../mocks/server/mvc/logMock")
  , DefaultModel = require(modelsPath + "/DefaultModel")
  , UtilityModel = require(modelsPath + "/UtilityModel");

describe("UtilityModel", function(){
  before(function(){
    UtilityModel.injectDependencies(configMock, logMock);
  });
  describe("Static", function(){
    describe("getConfig()", function(){
      it("Will return the same config data it received on 'injectDependencies'", function(){
        assert.typeOf(UtilityModel.getConfig(), "object");
        assert.deepEqual(UtilityModel.getConfig(), configMock);
      });
    });
  });
  describe("Instances (i.e.: new UtilityModel)", function(){
    it("Is instantiable", function(){
      var utilityModel = new UtilityModel;
      assert.typeOf(utilityModel, "object");
      expect(utilityModel).to.be.an.instanceOf(UtilityModel);
    });
    it("Should inherit correctly", function(){
      var utilityModel = new UtilityModel;
      expect(utilityModel).to.be.an.instanceOf(DefaultModel);
      expect(utilityModel).to.be.an.instanceOf(UtilityModel);
    });
    describe("getConfig()", function(){
      it("Will return the same config as the static 'getConfig'", function(){
        var utilityModel = new UtilityModel;
        var staticConfig = utilityModel.getConfig();
        assert.deepEqual(utilityModel.getConfig(), staticConfig);
      });
    });
  });
});
