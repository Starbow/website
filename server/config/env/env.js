var fs = require("fs");
var path = require("path");
var sprintf = require("sprintf-js").sprintf;
var _ = require("underscore");

var ACCEPTED_NODE_ENVS = ["production", "development", "test"];
if (process.env.NODE_ENV === undefined || ACCEPTED_NODE_ENVS.indexOf(process.env.NODE_ENV) <= -1) {
  throw new Error("Invalid NODE_ENV; process.env.NODE_ENV=" + process.env.NODE_ENV + "\n"
    + "Please:\n"
    + "  (1) Add 'export NODE_ENV=<ENVIRONMENT_NAME>' to your '~/.profile' (and then 'source ~/.profile'), or\n"
    + "  (2) Run 'NODE_ENV=<ENVIRONMENT_NAME> node server.js' instead\n"
    + "Replace '<ENVIRONMENT_NAME>' with one of: [\"" + ACCEPTED_NODE_ENVS.join('", "') + "\"]\n");
}

var rootDir = path.normalize(__dirname + "/../../..");
var envFileName = "env." + process.env.NODE_ENV + ".json",
  envFilePath = __dirname + "/" + envFileName,
  envExampleFileName = "env.example.json",
  envExampleFilePath = __dirname + "/" + envExampleFileName;

var getAndValidateEnvFileJSON = function(name, path){
  var json;
  try {
    json = fs.readFileSync(path, 'utf-8');
  } catch (e) {
    throw new Error(sprintf("You don't have an '%s' file in '%s'", name, __dirname));
  }
  try {
    json = JSON.parse(json);
  } catch (e) {
    throw new Error(sprintf("Your '%s' file contains invalid JSON. Did you leave a comma before the final '}'?", name));
  }
  return json;
};

var env = getAndValidateEnvFileJSON(envFileName, envFilePath);
var envExample = getAndValidateEnvFileJSON(envExampleFileName, envExampleFilePath);

// Check for key differences
var difference = _.difference(Object.keys(env), Object.keys(envExample));
if (difference.length > 0) {
  throw new Error(sprintf("The keys in '%s' and '%s' don't match. They must. Diverging keys are: ['%s']",
    envFileName, envExampleFileName, difference.join("', '")));
}

// Check for datatype differences
var errors = [];
for (var key in envExample) {
  if (typeof(envExample[key]) != typeof(env[key])) {
    errors.push(sprintf("Key '%s' must be of type '%s'; found '%s'",
      key, typeof(envExample[key]), typeof(env[key])));
  }
}
if (errors.length) {
  console.log('errors', errors)
  throw new Error(sprintf("found datatype mismatch(es) between '%s' and '%s':\n - %s\n",
    envFileName, envExampleFileName, errors.join("\n -")));
}

Object.keys(env).forEach(function(key){
  process.env[key] = env[key];
});

process.env.ROOT = rootDir;

Object.freeze(process.env);
