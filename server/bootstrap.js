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
  log.injectDependencies(logs.mvc);
  delete log.injectDependencies; // Don't allow "injectDependencies" to be re-run

  try {
    // Configure thinky (rethinkdb)
    var thinky = require("thinky")(config.db.thinky);

    // Load and configure certain models
    require('./bootstrap/models')(config, thinky);

    // Configure passport
    require('./bootstrap/passport')(config, passport);

    // Configure express
    require('./bootstrap/express')(app, logs, passport);

    // Configure routes
    require('./bootstrap/routes')(app, logs, passport);
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
