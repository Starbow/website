var BnetStrategy = require('passport-bnet').Strategy;
var log = require(process.env.ROOT + '/server/mvc/log');
var BattlenetUser = require(process.env.ROOT + "/server/mvc/models/User/BattlenetUser");

module.exports = function(authBnetConfig){
  return new BnetStrategy(
    authBnetConfig,
    function(accessToken, refreshToken, profile, done) {
      if (accessToken !== null && profile.id > 0) {
        BattlenetUser
          .createOrUpdate(profile.id, profile.battletag, accessToken, "bnet")
          .then(function(){
            return done(null, profile)
          })
          .error(function(){
            log.error("BnetStrategy (1):", err);
            return done(null, null);
          });
      } else {
        return done(null, null);
      }
    }
  );
};
