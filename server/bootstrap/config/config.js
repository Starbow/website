var fs = require("fs");
var sprintf = require("sprintf-js").sprintf;

var config;
var configFile = __dirname + '/config.json';

try {
  config = fs.readFileSync(configFile, 'utf-8');
} catch (e) {
  throw new Error(sprintf("You don't have an 'config.json' file in '%s'", __dirname));
}
try {
  config = JSON.parse(config);
} catch (e) {
  throw new Error("Your 'config.json' file contains invalid JSON. Did you leave a comma before the final '}'?");
}

module.exports = config;

module.exports.rethinkdb = {
  host: config.DB_HOST,
  port: parseInt(config.DB_PORT),
  db: config.DB_NAME
};

Object.freeze(config);
