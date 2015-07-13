var Class = require("node-class").class;
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

module.exports = Class("DevExamples", {
  extends: ["ThinkyDocumentModel"],
  initialize: function(){
    var ThinkyModel = getThinkyModel(this.getThinky());
    this.__parent(new ThinkyModel({}));
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
