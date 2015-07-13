var modelsPath = __dirname + "/models";

module.exports = function(config, thinky){
  var ThinkyDocumentModel = require(modelsPath + "/ThinkyDocumentModel");
  ThinkyDocumentModel.init(config, thinky);
  delete ThinkyDocumentModel.init; // Don't allow "init" to be re-run
};
