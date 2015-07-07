var fs = require("fs");
var path = require("path");
var sprintf = require("sprintf-js").sprintf;

var rootDir = path.normalize(__dirname + "/../../..");
var env;
var envFile = __dirname + '/env.json';

try {
  env = fs.readFileSync(envFile, 'utf-8');
} catch (e) {
  throw new Error(sprintf("You don't have an 'env.json' file in '%s'", __dirname));
}
try {
  env = JSON.parse(env);
} catch (e) {
  throw new Error("Your 'env.json' file contains invalid JSON. Did you leave a comma before the final '}'?");
}

Object.keys(env).forEach(function(key){
  process.env[key] = env[key];
});

process.env.ROOT = rootDir;

Object.freeze(process.env);
