"use strict";

var inherit = require("inherit");
var ConfigModel = require("./ConfigModel");

module.exports = inherit(ConfigModel, {}, {
  getClientId: function(){
    return this.getConfig().auth.bnet.clientID;
  }
});
