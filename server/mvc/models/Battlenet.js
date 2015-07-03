var Promise = require("bluebird");

var config,
  thinky;

module.exports = function(){
  var self = this;

  this.getClientId = function(){
    return config.auth.bnet.clientID;
  };
};

module.exports.init = function(_config, _thinky){
  config = _config;
  thinky = _thinky;
};
