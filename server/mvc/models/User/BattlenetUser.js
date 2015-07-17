"use strict";

var inherit = require("inherit");
var User = require("../User");
var Promise = require("bluebird");

var BattlenetUser = inherit(User, {
  fetchSC2InfoByRegion: function(region){
    var self = this;
    return new Promise(function(resolve, reject){
      var oauthToken = self.decryptOauthToken(self.getValue('oauthTokenEncrypted'));
      var bnet = require('battlenet-api')(self.getConfig().auth.bnet.clientID);
      bnet.account.sc2({origin: region, access_token: oauthToken}, function(err, response){
        // if (err) {
        //   return reject(err);
        // }
        return resolve(response);
      });
    });
  }
}, {

});

module.exports = BattlenetUser;
