var fs = require("fs");
var path = require("path");

module.exports = function(rootDir){
  rootDir = path.normalize(rootDir);

  var env = {};
  var envFile = rootDir + '/server/bootstrap/config/env/env.json';

  env = fs.readFileSync(envFile, 'utf-8');
  env = JSON.parse(env);
  Object.keys(env).forEach(function(key){
    process.env[key] = env[key];
  });
  process.env.ROOT = rootDir;
};
