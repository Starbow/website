var bnet = require('./passport/strategies/bnet');

module.exports = function(passport) {
  passport.serializeUser(function(user, done) {
    done(null, user);
  });
  passport.deserializeUser(function(obj, done) {
    done(null, obj);
  });

  // Use strategies
  passport.use(bnet);
};
