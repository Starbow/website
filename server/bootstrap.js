require("use-strict"); // Polices server code, applying "use strict" to all modules

var fs = require("fs");
var path = require("path");

var env = {};
var envFile = __dirname + '/bootstrap/config/env/env.json';

env = fs.readFileSync(envFile, 'utf-8');
env = JSON.parse(env);
Object.keys(env).forEach(function(key){
  process.env[key] = env[key];
});
process.env.ROOT = path.normalize(__dirname + '/..');

exports.startup = function(app, passport){
  var dbConfig = require('./bootstrap/config/db/rethinkdb.js');

  console.log("Bootstrap: Configuring passport");
  require('./bootstrap/passport.js')(passport);

  console.log("Bootstrap: Configuring express");
  require('./bootstrap/express.js')(app, passport);

  console.log("Bootstrap: Configuring models");
  require('./mvc/models.js')(dbConfig.config());

  console.log("Bootstrap: Configuring routes");
  require('./bootstrap/routes.js')(app, passport);
};
