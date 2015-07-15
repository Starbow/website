"use strict";

var inherit = require("inherit");
var ThinkyDocumentModel = require("./ThinkyDocumentModel");
var Promise = require("bluebird");

var thinky = ThinkyDocumentModel.getThinky();
var ThinkyModel = thinky.createModel("DevExamples", {
  someText: thinky.type.string().default(null).min(1).required().allowNull(false)
});

module.exports = inherit(ThinkyDocumentModel, {
  __constructor: function(){
    this.__base(new ThinkyModel({}));
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
    return ThinkyDocumentModel.getConfig().log.access;
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
