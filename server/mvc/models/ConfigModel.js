/**
 * A model from which the 'config' data for the application can be retrieved. Said data is injected.
 */
var Class = require('jsclass/src/core').Class;

var config;

module.exports = new Class({
  getConfig: function(){
    return config;
  },
});

module.exports.init = function(_config){
  config = _config;
};
