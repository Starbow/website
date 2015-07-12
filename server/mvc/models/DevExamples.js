var Class = require('jsclass/src/core').Class;
var DocumentModel = require("./DocumentModel");
var Promise = require("bluebird");

var config
  , thinky
  , ThinkyModel;

module.exports = new Class(DocumentModel, {
  initialize: function(){
    this.callSuper(new ThinkyModel({}));
  },
  whatIsOnePlusTwo: function(){
    return 1 + 2;
  },
  promiseMeEverythingWillBeAlright: function(){
    return new Promise(function(resolve, reject){
      resolve(true);
    });
  },
  getAccessLogConfigData: function(){
    return config.log.access;
  },
  saveInDatabaseAndReturnViaPromise: function(value){
    var self = this;
    return new Promise(function(resolve, reject){
      self.document.merge({someText: value});
      try {
        self.document.validate();
        self.document
          .save()
          .then(resolve)
          .error(reject);
      } catch (e) {
        reject(e);
      }
    });
  }
});

module.exports.init = function(_config, _thinky){
  config = _config;
  thinky = _thinky;
  ThinkyModel = thinky.createModel("DevExamples", {
    someText: thinky.type.string().default(null).min(1).required().allowNull(false)
  });
};
