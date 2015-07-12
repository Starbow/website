var Promise = require("bluebird");

var config
  , thinky
  , ThinkyModel;

module.exports = function(){
  var self = this
    , document = new ThinkyModel({});

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
  this.saveInDatabaseAndReturnViaPromise = function(value){
    return new Promise(function(resolve, reject){
      document.merge({someText: value});
      try {
        document.validate();
        document
          .save()
          .then(resolve)
          .error(reject);
      } catch (e) {
        reject(e);
      }
    });
  };
};

module.exports.init = function(_config, _thinky){
  config = _config;
  thinky = _thinky;
  ThinkyModel = thinky.createModel("DevExamples", {
    someText: thinky.type.string().default(null).min(1).required().allowNull(false)
  });
};
