var fs = require('fs');

var modelsPath = __dirname + "/models";

module.exports = function(dbConfig){
  fs.readdirSync(modelsPath).forEach(function(file){
    if (~file.indexOf('.js')) {
      /**
       * HERE BE DRAGONS!
       * Export namespaces are automatically generated for this module. E.g. if the 'file' variable is "Foo.js", then
       * the name for the corresponding export is "Foo".
       * Example usage:
       * var Models = require("models");
       * var foo = new Models.Foo();
       */
      var name = file.replace(/\.js$/, '');
      module.exports[name] = require(modelsPath + '/' + file);
      module.exports[name].init(dbConfig);
      delete module.exports[name].init; // Ensure 'init' cannot be called again
    }
  });
};
