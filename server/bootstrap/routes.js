var sprintf = require("sprintf-js").sprintf;

module.exports = function (app, logs, passport) {
  require("./routes/GET.js")(app, passport);
  require("./routes/POST.js")(app);
  require("./routes/PUT.js")(app);
  require("./routes/DELETE.js")(app);

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
