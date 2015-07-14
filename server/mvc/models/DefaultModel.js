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
        console.log("objectAsString", objectAsString)
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
  isNull: function(v){
    return (v === null);
  },
  isString: function(v){
    return (typeof(v) == "string");
  },
  guardIsNull: function(v){
    if (!this.isString(v)) {
      throw new TypeError("Parameter is not null; provided: " + this.getHumanReadableTypeAndValue(v));
    }
    return this;
  },
  guardIsString: function(v){
    if (!this.isString(v)) {
      throw new TypeError("Parameter is not a String; provided: " + this.getHumanReadableTypeAndValue(v));
    }
    return this;
  },
});
