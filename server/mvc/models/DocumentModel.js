var Class = require('jsclass/src/core').Class;
var Promise = require("bluebird");

var config
  , thinky;

module.exports =  new Class({
  initialize: function(document){
    this.document = document;
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

module.exports.init = function(_config, _thinky){
  config = _config;
  thinky = _thinky;
};

module.exports.config = function(){
  return config;
};

module.exports.thinky = function(){
  return thinky;
};
