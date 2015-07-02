require("use-strict"); // Polices server code, applying "use strict" to all modules

require("./bootstrap/config/env/env.js")(__dirname + "/..");
var config = require("./bootstrap/config/config.js");

exports.startup = function(app, passport){
  var thinky = require("thinky")(config.rethinkdb);

  console.log("Bootstrap: Configuring passport");
  require('./bootstrap/passport.js')(passport);

  console.log("Bootstrap: Configuring express");
  require('./bootstrap/express.js')(app, passport);

  console.log("Bootstrap: Configuring models");
  require('./mvc/models.js')(config, thinky);

  console.log("Bootstrap: Configuring routes");
  require('./bootstrap/routes.js')(app, passport);
};
