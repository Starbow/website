module.exports.init = function(log){
  module.exports = log;
  delete module.exports.init; // Voodoo: The function deletes itself to prevent re-init
};
