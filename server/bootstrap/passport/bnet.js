var config = require(process.env.ROOT + '/server/bootstrap/config/config.js');
var BnetStrategy = require('passport-bnet').Strategy;
var Models = require(process.env.ROOT + '/server/mvc/models.js');

module.exports = new BnetStrategy(
  {
    clientID: config.BNET_ID,
    clientSecret: config.BNET_SECRET,
    scope: "sc2.profile",
    callbackURL: "https://localhost/auth/bnet/callback"
  }, function(accessToken, refreshToken, profile, done) {
    if (accessToken !== null && profile.id > 0) {
      var user = new Models.User();
      var oauthTokenEncryptionSalt = config.BNET_OAUTH_TOKEN_ENCRYPTION_SALT;
      user
        .findByUserId(profile.id)
        .then(function(){
          user.setValues({
              oauthTokenEncrypted: user.encryptOauthToken(accessToken, oauthTokenEncryptionSalt),
              oauthType: "bnet"
          }).updateTimeLatestLogin();
          if (!user.exists()) {
            user.setValues({
                userId: profile.id
            });
          }
          user
            .save()
            .then(function(){
              console.log('Save: success', user.getValues());
              return done(null, profile);
            })
            .error(function(err){
              console.log("BnetStrategy (2):", err);
              return done(null, null);
            });
        })
        .error(function(err){
          console.log("BnetStrategy (1):", err);
          return done(null, null);
        });
    } else {
      return done(null, null);
    }
  }
);
