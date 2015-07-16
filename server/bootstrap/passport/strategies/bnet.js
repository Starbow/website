var BnetStrategy = require('passport-bnet').Strategy;
var log = require(process.env.ROOT + '/server/mvc/log');
var User = require(process.env.ROOT + "/server/mvc/models/User");

module.exports = function(authBnetConfig){
  return new BnetStrategy(
    authBnetConfig,
    function(accessToken, refreshToken, profile, done) {
      if (accessToken !== null && profile.id > 0) {
        User
          .createOrUpdate(profile.id, accessToken, "bnet")
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
