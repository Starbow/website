var config = require(process.env.ROOT + '/server/bootstrap/config.js');
var BnetStrategy = require('passport-bnet').Strategy;
var Models = require(process.env.ROOT + '/server/mvc/models.js');

module.exports = new BnetStrategy(
  config.auth.bnet,
  function(accessToken, refreshToken, profile, done) {
    if (accessToken !== null && profile.id > 0) {
      var user = new Models.User();
      user
        .findByUserId(profile.id)
        .then(function(){
          user.setValues({
              userId: profile.id,
              oauthTokenEncrypted: user.encryptOauthToken(accessToken, config.auth.bnet.encryptionSalt),
              oauthType: "bnet"
          }).updateTimeLatestLogin();
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
