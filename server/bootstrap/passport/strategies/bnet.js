var BnetStrategy = require('passport-bnet').Strategy;
var log = require(process.env.ROOT + '/server/mvc/log');
var User = require(process.env.ROOT + "/server/mvc/models/User");

module.exports = function(authBnetConfig){
  return new BnetStrategy(
    authBnetConfig,
    function(accessToken, refreshToken, profile, done) {
      if (accessToken !== null && profile.id > 0) {
        var user = new User();
        user
          .findByUserId(profile.id)
          .then(function(){
            log.debug("Updating existing user. 'profile':\n", profile);
          })
          .error(function(err){
            log.debug("Creating new user. 'profile':\n", profile);
          })
          .finally(function(){
            user.setValues({
                oauthTokenEncrypted: user.encryptOauthToken(accessToken),
                oauthType: "bnet",
                userId: profile.id
            })
            .updateTimeLatestLogin()
            .save()
            .then(function(){
              log.debug("User saved successfully. Values:\n", user.getValues());
              return done(null, profile);
            })
            .error(function(err){
              log.error("BnetStrategy (1):", err);
              return done(null, null);
            });
          });
      } else {
        return done(null, null);
      }
    }
  );
};
