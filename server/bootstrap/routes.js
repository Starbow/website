var morgan = require("morgan");
var sprintf = require("sprintf-js").sprintf;
var IndexController = require(process.env.ROOT + '/server/mvc/controllers/IndexController.js');
var ProfileController = require(process.env.ROOT + '/server/mvc/controllers/ProfileController.js');

module.exports = function (app, logs, passport) {
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
   * Development-only routes
   */
  if (process.env.NODE_ENV == 'development') {
    var DevExamplesController = require(process.env.ROOT + '/server/mvc/controllers/DevExamplesController.js');
    app.get('/dev-examples', DevExamplesController["index"]);
    app.get('/dev-examples/cluster-current-worker', DevExamplesController["cluster-current-worker"]);
    app.get('/dev-examples/model-interaction', DevExamplesController["model-interaction"]);
    app.get('/dev-examples/provoke-framework-error', DevExamplesController["provoke-framework-error"]);
    app.get('/dev-examples/retrieve-config-from-model', DevExamplesController["retrieve-config-from-model"]);
    app.get('/dev-examples/write-mvc-log', DevExamplesController["write-mvc-log"]);
  }

  /**
   * Error handling
   */

  // 500: We messed up
  app.use(function(err, req, res, next){
    if (err.message
      && (~err.message.indexOf('not found')
      || (~err.message.indexOf('Cast to ObjectId failed')))) {
      return next(); // Treat as 404
    }
    res.status(500);
    var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    var httpVersion = req.httpVersionMajor + '.' + req.httpVersionMinor;
    var stackTraceLines = err.stack.toString().replace(/\r\n|\n\r|\n|\r/g,"\n").split("\n");
    var stack = stackTraceLines.slice(0, process.env.ERROR_STACKTRACE_SIZE).join("\n");
    var fileOutput = sprintf(
      "%s | \"%s %s HTTP/%s\" %s | Stack:\n%s",
      ip,
      req.method,
      req.originalUrl,
      httpVersion,
      res.statusCode,
      stack
    );
    logs.framework.error(fileOutput);
    res.render('../error/500', {error: err.stack});
  });

  // 404: The user messed up
  app.use(function(req, res, next){
    res.status(404).render('../error/404', {
      url: req.originalUrl,
      error: 'Not found'
    });
  });
};
