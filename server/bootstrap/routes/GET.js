/**
 * RESTful:
 * Connects GET requests with corresponding Controllers and Actions.
 * Use to retrieve content without additional actions (i.e. not POST, PUT, or DELETE).
 */

var User = require(process.env.ROOT + "/server/mvc/models/User");
var IndexController = require(process.env.ROOT + '/server/mvc/controllers/IndexController.js');
var AdminController = require(process.env.ROOT + '/server/mvc/controllers/AdminController.js');
var Admin_UsersController = require(process.env.ROOT + '/server/mvc/controllers/Admin/UsersController.js');
var ProfileController = require(process.env.ROOT + '/server/mvc/controllers/ProfileController.js');

exports = module.exports = function(app, passport){
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

  /**
   * Admin pages
   */
   var middlewareRequireThatUserIsLoggedInAndIsAdmin = function(req, res, next){
     var notFound = function(){
       res.status(404).render('../error/404', {
         url: req.originalUrl,
         error: 'Not found'
       });
     };
     if (!req.isAuthenticated()) {
       return notFound();
     }
     var user = new User();
     user
      .findByUserId(req.user.id)
      .then(function(){
        if (user.isAdmin()) {
          return next();
        }
        return notFound();
      })
      .error(function(err){
        return notFound();
      });
   };
   app.all('/admin', middlewareRequireThatUserIsLoggedInAndIsAdmin, function(req, res, next){
     return next();
   });
   app.get('/admin', AdminController["index"]);
   app.get('/admin/users', Admin_UsersController["index"]);

  /**
   * Development-only routes
   */
  if (process.env.NODE_ENV == 'development') {
    var DevExamplesController = require(process.env.ROOT + '/server/mvc/controllers/DevExamplesController.js');
    app.get('/dev-examples', DevExamplesController["index"]);
    app.get('/dev-examples/cluster-current-worker', DevExamplesController["cluster-current-worker"]);
    app.get('/dev-examples/cluster-current-worker-kill', DevExamplesController["cluster-current-worker-kill"]);
    app.get('/dev-examples/model-interaction', DevExamplesController["model-interaction"]);
    app.get('/dev-examples/provoke-framework-error', DevExamplesController["provoke-framework-error"]);
    app.get('/dev-examples/retrieve-config-from-model', DevExamplesController["retrieve-config-from-model"]);
    app.get('/dev-examples/write-mvc-log', DevExamplesController["write-mvc-log"]);
  }
};
