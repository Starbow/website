var assert = require('chai').assert;
var expect = require('chai').expect;

var modelsPath = __dirname + "/../../../../../server/mvc/models"
  , bogusConfig = {
    bogus: "cake"
  }
  , ConfigModel = require(modelsPath + "/ConfigModel");

describe("ConfigModel", function(){
  before(function(){
    ConfigModel.init(bogusConfig);
  });
  it("Is instantiable", function(){
    var configModel = new ConfigModel;
    expect(configModel).to.be.an.instanceOf(ConfigModel);
  });
  describe("getConfig()", function(){
    it("Will return the same config data it received on 'init'", function(){
      var configModel = new ConfigModel;
      assert.typeOf(configModel.getConfig(), "object");
      assert.deepEqual(configModel.getConfig(), {bogus:"cake"});
    });
  });
});
