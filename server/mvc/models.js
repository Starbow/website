var modelsPath = __dirname + "/models";

module.exports = function(config, thinky){
  var DocumentModel = require(modelsPath + "/DocumentModel");
  DocumentModel.init(config, thinky);
  delete DocumentModel.init; // Don't allow "init" to be re-run
};
