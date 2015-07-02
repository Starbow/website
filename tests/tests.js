/**
 * Unit test suite
 * Prerequisites: nodeunit ("npm install nodeunit -g")
 * Help: https://github.com/caolan/nodeunit
 * Some tests involves connecting to a bogus database. Therefore, you might need to run "rethinkdb".
 */
process.chdir(__dirname);

try {
  var reporter = require('nodeunit').reporters.default;
}
catch(e) {
  console.error("Cannot find 'nodeunit' module.");
  process.exit();
}

require("../server/bootstrap/config/env/env.js")(__dirname + "/..");

var glob = require("glob");

var files = glob.sync(process.env.ROOT + "/tests/*/**/*Test.js");
reporter.run(files);
