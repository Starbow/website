var AbstractDocumentModel = require("./AbstractDocumentModel");
var Promise = require("bluebird");

var config, thinky, ThinkyModel;

module.exports = function(){
  var self = this, parent;

  this.whatIsOnePlusTwo = function(){
    return 1 + 2;
  };
  this.promiseMeEverythingWillBeAlright = function(){
    return new Promise(function(resolve, reject){
      resolve(true);
    });
  };
  this.getAccessLogConfigData = function(){
    return config.log.access;
  };
  /**
   * Due to inheritance from the "parent", this module has more functions than those you see in this module.
   */
  this.getListOfAllPublicFunctionsIncludingInherited = function(){
    var list = [];
    for (var name in self) {
      if (typeof(self[name]) == "function") {
        list.push(name);
      }
    }
    return list;
  };

  parent = new AbstractDocumentModel(self, new ThinkyModel({}));
};

module.exports.init = function(_config, _thinky){
  config = _config;
  thinky = _thinky;
  var type = thinky.type;
  ThinkyModel = thinky.createModel("devExamples", {
    someText: type.string().default(null).min(1).required().allowNull(false)
  });
};
