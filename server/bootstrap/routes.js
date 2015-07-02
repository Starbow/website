var IndexController = require(process.env.ROOT + '/server/mvc/controllers/IndexController.js');
var ProfileController = require(process.env.ROOT + '/server/mvc/controllers/ProfileController.js');

module.exports = function (app, passport) {
  app.get('/auth/bnet', passport.authenticate('bnet'));
  app.get('/auth/bnet/callback', passport.authenticate('bnet', {failureRedirect: '/'}), function(req, res){
    res.redirect('/');
  });
  app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
  });
  app.get('/profile/info', ProfileController.info);
  app.get('/profile/matchhistory', ProfileController.matchhistory);
  app.get('/userstuff', IndexController.userstuff); // TODO: Temporary development endpoint
  app.get('/', IndexController.index);
};
