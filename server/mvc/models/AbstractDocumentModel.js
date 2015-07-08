var extend = require("extend");
var Promise = require("bluebird");

/**
 * HERE BE DRAGONS AND DARK MAGIC!
 * This module is a means of achieving class inheritance in models, including a functionality similar to "protected"
 * variables and function by referencing the "parent" variable in the child class.
 * In PHP, the equivalent would be like: "class Foo extends AbstractDocumentModel"
 */
module.exports = function(child, document){
  var self = this;

  /**
   * Protected. Reference through "parent" variable in child class.
   */
  this.document = document;

  /**
   * The "child" will inherit functions below.
   */
  var PublicFunctionsInheritedByChild = {
    save: function(){
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
      self.document.merge(obj);
      self.document.validate();
      return this;
    },
    setValues: function(obj){
      self.document.merge(obj);
      self.document.validate();
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
      for (var i in self.document) {
        if (self.document.hasOwnProperty(i))
          clone[i] = self.document[i];
      }
      return clone;
    },
    /**
     * Database validity check.
     * @return (Boolean) "true" if the document has been saved or fetched via the "get" function. Otherwise "false".
     */
    existsInDatabase: function(){
      return self.document.isSaved();
    },
    /**
     * Document validity check. Does not check if the document exists in the database; for this, use "existsInDatabase".
     * @return (Boolean) "true" if the entire document is valid. Otherwise "false".
     */
    isValid: function(){
      try {
        self.document.validate();
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
    }
  };

  extend(child, PublicFunctionsInheritedByChild);
};
