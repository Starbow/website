exports.provokeerror = function(req, res){
  throw new Error("This should show the '500' page, output in console (with colors), and write to 'error.log'");
};
