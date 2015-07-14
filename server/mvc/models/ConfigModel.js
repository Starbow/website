"use strict";

/**
 * A model from which the 'config' data for the application can be retrieved. Said data is injected.
 */
var inherit = require("inherit");
var DefaultModel = require("./DefaultModel");

var config;

module.exports = inherit(DefaultModel, {}, {
  getConfig: function(){
    return config;
  },
});

module.exports.init = function(_config){
  config = _config;
  Object.freeze(config);
};
