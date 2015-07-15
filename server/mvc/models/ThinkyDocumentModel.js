"use strict";

var inherit = require("inherit");
var ConfigModel = require("./ConfigModel");
var Promise = require("bluebird");

var thinky;

module.exports = inherit(ConfigModel, {
  __constructor: function(document){
    this.document = document;
  },
  find: function(id){ // Find by 'id' (or primary key)
    var self = this;
    return new Promise(function(resolve, reject){
      self.document
        .getModel()
        .get(id)
        .run()
        .then(function(doc){
          self.document = doc;
          return resolve();
        })
        .error(reject);
    });
  },
  findByFilter: function(filter, orderBy){
    var self = this;
    return new Promise(function(resolve, reject){
      var model = self.document.getModel();
      model.filter(filter);
      if (self.validateIsObject(orderBy)) {
        model.orderBy(orderBy);
      }
      model
        .limit(1)
        .run()
        .then(function(docs){
          if (!docs.length) {
            return reject(new Error("Document not found"));
          }
          self.document = docs[0];
          return resolve();
        })
        .error(reject);
    });
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
    return this;
  },
  setValues: function(obj){
    this.guardIsObject(obj);
    this.document.merge(obj);
    return this;
  },
  getValue: function(key){
    var values = this.getValues();
    if (values.hasOwnProperty(key)) {
      return values[key];
    }
    return undefined;
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
      throw new Error("guardExistsInDatabase: 'document' does not exist in database");
    }
    return this;
  },
  guardIsValid: function(){
    if (!this.isValid()) {
      throw new Error("guardIsValid: 'document' is not valid");
    }
    return this;
  },
}, {
  getThinky: function(){
    return thinky;
  },
});

module.exports.init = function(_thinky){
  thinky = _thinky;
};
