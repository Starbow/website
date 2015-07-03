var Promise = require("bluebird");

var config,
  thinky;

module.exports = function(){
  var self = this;

  this.whatIsOnePlusTwo = function(){
    return 1 + 2;
  };
  this.promimeMeEverythingWillBeAlright = function(){
    return new Promise(function(resolve, reject){
      resolve(true);
    });
  };
};

module.exports.init = function(_config, _thinky){
  config = _config;
  thinky = _thinky;
};
