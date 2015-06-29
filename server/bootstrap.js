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

exports.startup = function(app, passport){
  console.log("Boostrap: Setting up autoload models");
  fs.readdirSync(process.env.ROOT + '/server/mvc/models').forEach(function (file) {
    if (~file.indexOf('.js')) require(process.env.ROOT + '/server/mvc/models/' + file);
  });

  console.log("Boostrap: Configuring passport");
  require(process.env.ROOT + '/server/bootstrap/passport.js')(passport);

  console.log("Boostrap: Configuring express");
  require(process.env.ROOT + '/server/bootstrap/express.js')(app, passport);

  console.log("Boostrap: Configuring routes");
  require(process.env.ROOT + '/server/bootstrap/routes.js')(app, passport);
};
