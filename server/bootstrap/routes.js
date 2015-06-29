var controllerIndex = require(process.env.ROOT + '/server/mvc/controllers/index.js');
var controllerProfile = require(process.env.ROOT + '/server/mvc/controllers/profile.js');

module.exports = function (app, passport) {
  app.get('/auth/bnet', passport.authenticate('bnet'));
  app.get('/auth/bnet/callback', passport.authenticate('bnet', {failureRedirect: '/'}), function(req, res){
    res.redirect('/');
  });
  app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
  });
  app.get('/profile/info', controllerProfile.info);
  app.get('/profile/matchhistory', controllerProfile.matchhistory);
  app.get('/userstuff', controllerIndex.userstuff); // TODO: Temporary development endpoint
  app.get('/', controllerIndex.index);
};
