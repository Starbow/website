"use strict";

var inherit = require("inherit");
var User = require("../User");
var Promise = require("bluebird");

var BattlenetUser = inherit(User, {
  fetchSC2Info: function(){
    var self = this;
    return new Promise(function(resolve, reject){
      var oauthToken = self.decryptOauthToken(self.getValue('oauthTokenEncrypted'));
      var bnet = require('battlenet-api')(self.getConfig().auth.bnet.clientID);
      bnet.account.sc2({origin: 'eu', access_token: oauthToken}, function(err, response){
        if (err) {
          return reject(err);
        }
        return resolve(response);
      });
    });
  }
}, {
  createOrUpdate: function(userId, battletag, accessToken, oauthType){
    var self = this;
    return new Promise(function(resolve, reject){
      var battlenetUser = new BattlenetUser();
      battlenetUser
        .findByUserId(userId)
        .then(function(){
          self.getLog().debug(sprintf("Updating existing user: [userId: %s]", userId));
        })
        .error(function(err){
          self.getLog().debug(sprintf("Creating new user: [userId: %s]", userId));
        })
        .finally(function(){
          battlenetUser.setValues({
              battletag: battletag,
              nickname: BattlenetUser.generateNicknameFromBattletag(battletag),
              oauthTokenEncrypted: BattlenetUser.encryptOauthToken(accessToken),
              oauthType: oauthType,
              userId: userId
          })
          .updateTimeLatestLogin()
          .save()
          .then(function(){
            self.getLog().debug("User saved successfully. Values:\n", battlenetUser.getValues());
            return resolve();
          })
          .error(reject);
        });
    });
  },
  generateNicknameFromBattletag: function(battletag){
    return battletag.replace(/\#\d+$/, "");
  }
});

module.exports = BattlenetUser;
