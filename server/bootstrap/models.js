var modelsPath = __dirname + "/../mvc/models";

module.exports = function(config, mvcLog, thinky){
  var UtilityModel = require(modelsPath + "/UtilityModel");
  UtilityModel.injectDependencies(config, mvcLog);
  delete UtilityModel.injectDependencies; // Don't allow "injectDependencies" to be re-run
  var ThinkyDocumentModel = require(modelsPath + "/ThinkyDocumentModel");
  ThinkyDocumentModel.injectDependencies(thinky);
  delete ThinkyDocumentModel.injectDependencies; // Don't allow "injectDependencies" to be re-run
};
