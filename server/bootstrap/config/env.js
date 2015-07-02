var fs = require("fs");
var path = require("path");
var sprintf = require("sprintf-js").sprintf;

module.exports = function(rootDir){
  rootDir = path.normalize(rootDir);

  var env = {};
  var envFile = __dirname + '/env/env.json';

  try {
    env = fs.readFileSync(envFile, 'utf-8');
  } catch (e) {
    throw new Error(sprintf("You don't have an 'env.json' file in '%s'", __dirname + "/env"));
  }
  try {
    env = JSON.parse(env);
  } catch (e) {
    throw new Error("Your 'env.json' file contains invalid JSON");
  }
  Object.keys(env).forEach(function(key){
    process.env[key] = env[key];
  });
  process.env.ROOT = rootDir;
};
