require("use-strict"); // Polices server code, applying "use strict" to all modules

require("./bootstrap/config/env.js")(__dirname + "/..");

exports.startup = function(app, passport){
  var dbConfig = require('./bootstrap/config/db/rethinkdb.js');
  var thinky = require("thinky")(dbConfig);

  console.log("Bootstrap: Configuring passport");
  require('./bootstrap/passport.js')(passport);

  console.log("Bootstrap: Configuring express");
  require('./bootstrap/express.js')(app, passport);

  console.log("Bootstrap: Configuring models");
  require('./mvc/models.js')(thinky);

  console.log("Bootstrap: Configuring routes");
  require('./bootstrap/routes.js')(app, passport);
};
