var fs = require('fs');

var modelsPath = __dirname + "/models";

module.exports = function(config, thinky){
  var DocumentModel = require(modelsPath + "DocumentModel");
  DocumentModel.init(config, thinky);
  delete DocumentModel.init; // Don't allow "init" to be re-run
  fs.readdirSync(modelsPath).forEach(function(file){
    if (~file.indexOf('.js')) {
      /**
       * HERE BE DRAGONS!
       * Export namespaces are automatically generated for this module. E.g. if the 'file' variable is "Foo.js", then
       * the name for the corresponding export is "Foo".
       * Example usage:
       * var Models = require("models");
       * var Foo = new Models.Foo();
       * var foo = new Foo();
       */
      var name = file.replace(/\.js$/, '');
      var model = require(modelsPath + '/' + file);
      module.exports[name] = model;
    }
  });
};
