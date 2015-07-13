require("use-strict"); // Polices server code, applying "use strict" to all modules

var fs = require('fs');
var cluster = require('cluster');
var passport = require('passport');
var sprintf = require('sprintf-js').sprintf;

var isReady = false,
    onReadyCallback;

var runOnReadyCallback = function(){
  if (typeof(onReadyCallback) == "function") {
    onReadyCallback();
  }
};

exports.startup = function(app, config, logs){
  var log = require('./mvc/log.js');
  log.init(logs.mvc);

  try {
    // Configure passport
    require('./bootstrap/passport.js')(config, passport);

    // Configure express
    require('./bootstrap/express.js')(app, logs, passport);

    // Configure thinkg (rethinkdb)
    var thinky = require("thinky")(config.db.thinky);

    // Load and configure certain models
    require('./mvc/models')(config, thinky);

    // Configure routes
    require('./bootstrap/routes.js')(app, logs, passport);
  } catch (e) {
    var errorType = (e instanceof Error) ? "Error" : "Exception";
    logs.framework.error(sprintf("Worker [id: %s]: Uncaught '%s':", cluster.worker.id, errorType), e);
    process.exit(); // Crash and burn; learn2code
    return;
  }

  isReady = true;
  runOnReadyCallback();
};

exports.onReady = function(callback){
  onReadyCallback = callback;
  if (isReady) {
    runOnReadyCallback();
  }
};
