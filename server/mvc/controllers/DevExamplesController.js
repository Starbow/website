var log = require("../log");
var Models = require('../models.js');
var assert = require('assert');

/**
 * Example: How interact with a model.
 */
exports["model-interaction"] = function(req, res){
  var devExamples = new Models.DevExamples();
  assert.strictEqual(devExamples.whatIsOnePlusTwo(), 3, "What is 1+2, indeed?");
  devExamples
    .promiseMeEverythingWillBeAlright()
    .then(function(isItAlright){
      assert.ok(isItAlright, "Is it alright?");
      return res.send("Interacted with model 'Models.DevExamples' without breaking stuff!");
    });
};

/**
 * Example: How Errors and Exceptions automatically appear in 'server/data/logs/framework.log'.
 */
exports["provoke-framework-error"] = function(req, res){
  throw new Error("This should show the '500' page, output in console (with colors), and write to 'framework.log'");
};

/**
 * Example: How to retrieve "config" data from a model in a controller.
 */
exports["retrieve-config-from-model"] = function(req, res){
  var devExamples = new Models.DevExamples();
  return res.send("Access log config data: " + JSON.stringify(devExamples.getAccessLogConfigData()));
};

/**
 * Example: How to use the mvc log. The 'server/mvc/log' writes to 'server/data/logs/mvc.log'
 */
exports["write-mvc-log"] = function(req, res){
  log.debug("This message is an example of how to use the 'log' module in 'server/mvc'");
  return res.send("Wrote debug message in 'mvc.log'");
};

/**
 * Make a nice index page with links to examples.
 */
var actions = Object.keys(exports);
exports.index = function(req, res){
  return res.render('dev-examples/index', {
    uriBase: '/dev-examples',
    actions: actions
  });
};
