var log = require("../log");

/**
 * Example: How Errors and Exceptions automatically appear in 'server/data/logs/error.log'.
 */
exports["provoke-error"] = function(req, res){
  throw new Error("This should show the '500' page, output in console (with colors), and write to 'error.log'");
};

/**
 * Example: How to use the manual log. The 'server/mvc/log' writes to 'server/data/logs/manual.log'
 */
exports["write-manual-log"] = function(req, res){
  log.debug("This message is an example of how to use the 'log' module in 'server/mvc'");
  return res.send("Wrote debug message in 'manual.log'");
};
