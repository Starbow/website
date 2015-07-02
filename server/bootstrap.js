require("use-strict"); // Polices server code, applying "use strict" to all modules

console.log("Bootstrap: Setting up 'env' and 'config'");
require("./bootstrap/config/env/env.js");
var config = require("./bootstrap/config.js");

exports.startup = function(app, passport){
  console.log("Bootstrap: Configuring logs");
  require('./bootstrap/logs.js')(config);

  console.log("Bootstrap: Configuring passport");
  require('./bootstrap/passport.js')(passport);

  console.log("Bootstrap: Configuring express");
  require('./bootstrap/express.js')(app, passport);

  console.log("Bootstrap: Configuring models");
  var thinky = require("thinky")(config.db.thinky);
  require('./mvc/models.js')(config, thinky);

  console.log("Bootstrap: Configuring routes");
  require('./bootstrap/routes.js')(app, passport);
};
