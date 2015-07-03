module.exports = function(config, passport) {
  passport.serializeUser(function(user, done) {
    done(null, user);
  });
  passport.deserializeUser(function(obj, done) {
    done(null, obj);
  });

  // Use strategies
  var bnet = require('./passport/strategies/bnet')(config.auth.bnet);
  passport.use(bnet);
};
