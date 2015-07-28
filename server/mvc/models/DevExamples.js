"use strict";

var inherit = require("inherit");
var ThinkyDocumentModel = require("./ThinkyDocumentModel");
var Promise = require("bluebird");

var ThinkyDevExamplesModel = require("./DevExamples/DevExamplesMapper");

module.exports = inherit(ThinkyDocumentModel, {
  __constructor: function(){
    this.__base(new ThinkyDevExamplesModel({}));
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
