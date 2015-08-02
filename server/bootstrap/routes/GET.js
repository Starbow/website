/**
 * RESTful:
 * Connects GET requests with corresponding Controllers and Actions.
 * Use to retrieve content without additional actions (i.e. not POST, PUT, or DELETE).
 */

var User = require(process.env.ROOT + "/server/mvc/models/User");
var IndexController = require(process.env.ROOT + '/server/mvc/controllers/IndexController.js');
var LoginController = require(process.env.ROOT + '/server/mvc/controllers/LoginController.js');
var AdminController = require(process.env.ROOT + '/server/mvc/controllers/AdminController.js');
var Admin_UsersController = require(process.env.ROOT + '/server/mvc/controllers/Admin/UsersController.js');
var ProfileController = require(process.env.ROOT + '/server/mvc/controllers/ProfileController.js');

exports = module.exports = function(app, passport){
  app.get('/auth/bnet', passport.authenticate('bnet'));
  app.get('/auth/bnet/callback', passport.authenticate('bnet', {failureRedirect: '/login/failure'}), function(req, res){
    res.redirect('/');
  });
  app.get('/logout', IndexController.logout);
  app.get('/profile/info', ProfileController.info);
  app.get('/profile/matchhistory', ProfileController.matchhistory);
  app.get('/userstuff', IndexController.userstuff); // TODO: Temporary development endpoint
  app.get('/', IndexController.index);

  app.get('/login', LoginController.index);
  app.get('/login/failure', LoginController.failure);

  /**
   * Admin pages
   */
   var middlewareUserMustBeAdmin = require("./middleware/userMustBeAdmin");
   app.all('/admin', middlewareUserMustBeAdmin, function(req, res, next){
     return next();
   });
   app.all('/admin/*', middlewareUserMustBeAdmin, function(req, res, next){
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
