var fs = require('fs');
var path = require('path');

var env = {};
var envFile = __dirname + '/bootstrap/config/env/env.json';

env = fs.readFileSync(envFile, 'utf-8');
env = JSON.parse(env);
Object.keys(env).forEach(function(key){
  process.env[key] = env[key];
});
process.env.ROOT = path.normalize(__dirname + '/..');

var db = require(__dirname + '/bootstrap/config/db/rethinkdb.js');

exports.startup = function(app, passport){
  console.log("Bootstrap: Setting up database (RethinkDB)");
  db.setup();

  console.log("Bootstrap: Setting up autoload models");
  var modelsPath = '/server/mvc/models';
  Models = {};
  fs.readdirSync(process.env.ROOT + modelsPath).forEach(function(file){
    if (~file.indexOf('.js')) {
      require(process.env.ROOT + modelsPath + '/' + file)(db.getInstance());
    }
  });

  console.log("Bootstrap: Configuring passport");
  require(process.env.ROOT + '/server/bootstrap/passport.js')(passport);

  console.log("Bootstrap: Configuring express");
  require(process.env.ROOT + '/server/bootstrap/express.js')(app, passport);

  console.log("Bootstrap: Configuring routes");
  require(process.env.ROOT + '/server/bootstrap/routes.js')(app, passport);
};
