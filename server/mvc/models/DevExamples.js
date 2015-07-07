var Promise = require("bluebird");

var config,
  thinky;

module.exports = function(){
  var self = this;

  this.whatIsOnePlusTwo = function(){
    return 1 + 2;
  };
  this.promiseMeEverythingWillBeAlright = function(){
    return new Promise(function(resolve, reject){
      resolve(true);
    });
  };
  this.getAccessLogConfigData = function(){
    return config.log.access;
  };
};

module.exports.init = function(_config, _thinky){
  config = _config;
  thinky = _thinky;
};
