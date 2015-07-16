"use strict";

/**
 * A model from which the 'config' data for the application can be retrieved. Said data is injected.
 */
var inherit = require("inherit");
var DefaultModel = require("./DefaultModel");

var config;

var ConfigModel = inherit(DefaultModel, {
  getConfig: function(){
    return ConfigModel.getConfig();
  },
}, {
  getConfig: function(){
    return config;
  },
});

module.exports = ConfigModel;

module.exports.init = function(_config){
  config = _config;
  Object.freeze(config);
};
