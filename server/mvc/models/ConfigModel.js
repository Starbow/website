"use strict";

/**
 * A model from which the 'config' data for the application can be retrieved. Said data is injected.
 */
var Class = require("js.class");

var config;

module.exports = Class({
  getConfig: function(){
    return config;
  },
});

module.exports.init = function(_config){
  config = _config;
  Object.freeze(config);
};
