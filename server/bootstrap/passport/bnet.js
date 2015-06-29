var session = require('express-session');

var BnetStrategy = require('passport-bnet').Strategy;

module.exports = new BnetStrategy(
  {
    clientID: process.env.BNET_ID,
    clientSecret: process.env.BNET_SECRET,
    scope: "sc2.profile",
    callbackURL: "https://localhost/auth/bnet/callback"
  }, function(accessToken, refreshToken, profile, done) {
    session.OAuthAccessToken = accessToken;
    return done(null, profile);
  }
);
