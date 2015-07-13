var modelsPath = __dirname + "/models";

module.exports = function(config, thinky){
  var ConfigModel = require(modelsPath + "/ConfigModel");
  ConfigModel.init(config);
  delete ThinkyDocumentModel.init; // Don't allow "init" to be re-run
  var ThinkyDocumentModel = require(modelsPath + "/ThinkyDocumentModel");
  ThinkyDocumentModel.init(thinky);
  delete ThinkyDocumentModel.init; // Don't allow "init" to be re-run
};
