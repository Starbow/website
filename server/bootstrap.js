require("use-strict"); // Polices server code, applying "use strict" to all modules

var fs = require('fs');

console.log("Bootstrap: Setting up 'env' and 'config'");
require("./bootstrap/config/env/env.js");
var config = require("./bootstrap/config.js");

exports.startup = function(app, passport){
  console.log("Bootstrap: Ensuring 'server/data' directory exists");
  var dataDirPath = process.env.ROOT + "/server/data";
  if (!fs.existsSync(dataDirPath)) {
    fs.mkdirSync(dataDirPath);
  }

  console.log("Bootstrap: Configuring logs");
  var logs = require('./bootstrap/logs.js')(config);

  try {
    console.log("Bootstrap: Configuring passport");
    require('./bootstrap/passport.js')(passport);

    console.log("Bootstrap: Configuring express");
    require('./bootstrap/express.js')(app, logs, passport);

    console.log("Bootstrap: Configuring models");
    var thinky = require("thinky")(config.db.thinky);
    require('./mvc/models.js')(config, thinky);

    console.log("Bootstrap: Configuring routes");
    require('./bootstrap/routes.js')(app, logs, passport);
  } catch (e) {
    var errorType = (e instanceof Error) ? "Error" : "Exception";
    logs.error.error('Uncaught ' + errorType + ":", e);
    process.exit(); // Crash and burn; learn2code
    return;
  }
};
