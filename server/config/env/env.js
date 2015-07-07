var fs = require("fs");
var path = require("path");
var sprintf = require("sprintf-js").sprintf;

var ACCEPTED_NODE_ENVS = ["production", "development", "test"];
if (process.env.NODE_ENV === undefined || ACCEPTED_NODE_ENVS.indexOf(process.env.NODE_ENV) <= -1) {
  throw new Error("Invalid NODE_ENV; process.env.NODE_ENV=" + process.env.NODE_ENV + "\n"
    + "Please:\n"
    + "  (1) Add 'export NODE_ENV=<ENVIRONMENT_NAME>' to your '.profile', or\n"
    + "  (2) Run 'NODE_ENV=<ENVIRONMENT_NAME> node server.js'\n"
    + "Replace '<ENVIRONMENT_NAME>' with one of: [\"" + ACCEPTED_NODE_ENVS.join('", "') + "\"]\n");
}

var rootDir = path.normalize(__dirname + "/../../..");
var env;
var envFileName = "env." + process.env.NODE_ENV + ".json";
var envFilePath = __dirname + "/" + envFileName;

try {
  env = fs.readFileSync(envFilePath, 'utf-8');
} catch (e) {
  throw new Error(sprintf("You don't have an '%s' file in '%s'", envFileName, __dirname));
}
try {
  env = JSON.parse(env);
} catch (e) {
  throw new Error(sprintf("Your '%s' file contains invalid JSON. Did you leave a comma before the final '}'?",
    envFileName));
}

Object.keys(env).forEach(function(key){
  process.env[key] = env[key];
});

process.env.ROOT = rootDir;

Object.freeze(process.env);
