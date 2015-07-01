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

  console.log("Bootstrap: Setting up autoload models");
  var modelsPath = '/server/mvc/models';
  Models = {};
  fs.readdirSync(process.env.ROOT + modelsPath).forEach(function(file){
    if (~file.indexOf('.js')) {
      require(process.env.ROOT + modelsPath + '/' + file)(dbConfig.config());
    }
  });
  var dbConfig = require('./bootstrap/config/db/rethinkdb.js');

  console.log("Bootstrap: Configuring passport");
  require('./bootstrap/passport.js')(passport);

  console.log("Bootstrap: Configuring express");
  require('./bootstrap/express.js')(app, passport);

  console.log("Bootstrap: Configuring routes");
  require('./bootstrap/routes.js')(app, passport);
};
