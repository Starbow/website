"use strict";

/**
 * A model containing utility tools, e.g. 'config' data, loggers, etc.
 */
var inherit = require("inherit");
var DefaultModel = require("./DefaultModel");

var config;
var log;

var UtilityModel = inherit(DefaultModel, {
  getConfig: function(){
    return UtilityModel.getConfig();
  },
  getLog: function(){
    return UtilityModel.getLog();
  },
}, {
  getConfig: function(){
    return config;
  },
  getLog: function(){
    return log;
  }
});

module.exports = UtilityModel;

module.exports.injectDependencies = function(_config, _mvcLog){
  config = _config;
  log = _mvcLog;
  Object.freeze(config);
};
