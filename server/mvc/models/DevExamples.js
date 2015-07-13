var Class = require('jsclass/src/core').Class;
var ThinkyDocumentModel = require("./ThinkyDocumentModel");
var Promise = require("bluebird");

var ThinkyModel;
var getThinkyModel = function(thinky){
  if (ThinkyModel === undefined) {
    ThinkyModel = thinky.createModel("DevExamples", {
      someText: thinky.type.string().default(null).min(1).required().allowNull(false)
    });
  }
  return ThinkyModel;
};

module.exports = new Class(ThinkyDocumentModel, {
  initialize: function(){
    var ThinkyModel = getThinkyModel(this.getThinky());
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
    return this.getConfig().log.access;
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
