"use strict";

/**
 * A bottom-level model with only the most generic functions, e.g. validators and guards.
 */
var inherit = require("inherit");

var ucfirst = function(str){
  return str.charAt(0).toUpperCase() + str.substr(1);
};

module.exports = inherit({
  getHumanReadableTypeAndValue: function(v){
    if (v === undefined) {
      return "undefined";
    }
    if (v === null) {
      return "null";
    }
    if (typeof(v) == "object") {
      if (v instanceof Array) {
        var strArray = "(Array)";
        var arrayAsString = "";
        try {
          arrayAsString = v.toString();
        } catch (e) {}
        if ((arrayAsString.length + 5) > 20) {
          arrayAsString = arrayAsString.substr(0, 15) + " ... ";
        }
        strArray += " [" + arrayAsString + "]";
        return strArray;
      }
      var strObject = "(Object)";
      var objectAsString;
      try {
        objectAsString = JSON.stringify(v);
        if ((objectAsString.length + 5) > 20) {
          objectAsString = objectAsString.substr(0, 15) + " ... }";
        }
      } catch (e) {
        objectAsString = "{ ... }";
      }
      strObject += " " + objectAsString;
      return strObject;
    }
    var type = typeof(v);
    var str = "(" + ucfirst(type) + ")";
    try {
      str += " " + v.toString();
    } catch (e) {}
    return str;
  },
  validateIsArray: function(v){
    return (
      this.validateIsObject(v)
      && (v instanceof Array)
    );
  },
  validateIsInteger: function(v){
    return (
      this.validateIsNumber(v)
      && v === Math.floor(v)
    );
  },
  validateIsNull: function(v){
    return (v === null);
  },
  validateIsNumber: function(v){
    return (typeof(v) == "number");
  },
  validateIsObject: function(v){
    return (
      !this.validateIsNull(v) // Javascript considers null to be an Object - derp
      && (v instanceof Object)
    );
  },
  validateIsString: function(v){
    return (typeof(v) == "string");
  },
  validateIsUndefined: function(v){
    return (v === undefined);
  },
  guardIsArray: function(v){
    if (!this.validateIsArray(v)) {
      throw new TypeError("guardIsArray: Parameter is not an Integer; provided: " + this.getHumanReadableTypeAndValue(v));
    }
    return this;
  },
  guardIsInteger: function(v){
    if (!this.validateIsInteger(v)) {
      throw new TypeError("guardIsInteger: Parameter is not an Integer; provided: " + this.getHumanReadableTypeAndValue(v));
    }
    return this;
  },
  guardIsNull: function(v){
    if (!this.validateIsNull(v)) {
      throw new TypeError("guardIsNull: Parameter is not null; provided: " + this.getHumanReadableTypeAndValue(v));
    }
    return this;
  },
  guardIsNumber: function(v){
    if (!this.validateIsNumber(v)) {
      throw new TypeError("guardIsNumber: Parameter is not a Number; provided: " + this.getHumanReadableTypeAndValue(v));
    }
    return this;
  },
  guardIsObject: function(v){
    if (!this.validateIsObject(v)) {
      throw new TypeError("guardIsObject: Parameter is not an Integer; provided: " + this.getHumanReadableTypeAndValue(v));
    }
    return this;
  },
  guardIsString: function(v){
    if (!this.validateIsString(v)) {
      throw new TypeError("guardIsString: Parameter is not a String; provided: " + this.getHumanReadableTypeAndValue(v));
    }
    return this;
  },
  guardIsUndefined: function(v){
    if (!this.validateIsUndefined(v)) {
      throw new TypeError("guardIsUndefined: Parameter is not a String; provided: " + this.getHumanReadableTypeAndValue(v));
    }
    return this;
  },
});
