"use strict";

var inherit = require("inherit");
var ConfigModel = require("./ConfigModel");
var Promise = require("bluebird");

var thinky;

module.exports = inherit(ConfigModel, {
  __constructor: function(document){
    this.document = document;
  },
  getThinky: function(){
    return thinky;
  },
  save: function(){
    var self = this;
    return new Promise(function(resolve, reject){
      try {
        self.document.validate();
      } catch (e) {
        return reject(e);
      }
      self.document
        .save()
        .then(function(){
          return resolve();
        })
        .error(reject);
    });
  },
  setValue: function(key, value){
    var obj = {};
    obj[key] = value;
    this.document.merge(obj);
    this.document.validate();
    return this;
  },
  setValues: function(obj){
    this.document.merge(obj);
    this.document.validate();
    return this;
  },
  getValue: function(key){
    var values = this.getValues();
    if (values.hasOwnProperty(key)) {
      return values[key];
    }
    return null;
  },
  getValues: function(){
    var clone = {};
    for (var i in this.document) {
      if (this.document.hasOwnProperty(i))
        clone[i] = this.document[i];
    }
    return clone;
  },
  /**
   * Database validity check.
   * @return (Boolean) "true" if the document has been saved or fetched via the "get" function. Otherwise "false".
   */
  existsInDatabase: function(){
    return this.document.isSaved();
  },
  /**
   * Document validity check. Does not check if the document exists in the database; for this, use "existsInDatabase".
   * @return (Boolean) "true" if the entire document is valid. Otherwise "false".
   */
  isValid: function(){
    try {
      this.document.validate();
    } catch (e) {
      return false;
    }
    return true;
  },
  guardExistsInDatabase: function(){
    if (!this.existsInDatabase()) {
      throw new Error("User does not exist in database");
    }
    return this;
  },
  guardIsValid: function(){
    if (!this.isValid()) {
      throw new Error("User is not valid");
    }
    return this;
  },
});

module.exports.init = function(_thinky){
  thinky = _thinky;
};
