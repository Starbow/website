var modelsPath = __dirname + "/../mvc/models";

module.exports = function(config, thinky){
  var ConfigModel = require(modelsPath + "/ConfigModel");
  ConfigModel.init(config);
  delete ConfigModel.init; // Don't allow "init" to be re-run
  var ThinkyDocumentModel = require(modelsPath + "/ThinkyDocumentModel");
  ThinkyDocumentModel.init(thinky);
  delete ThinkyDocumentModel.init; // Don't allow "init" to be re-run
};
