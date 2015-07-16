var User = require("../models/User");

exports.index = function(req, res){
  if(!req.isAuthenticated()) {
    return res.render('index/index', {
      title: 'Starbow'
    });
  }
  res.render('index/indexAuthenticated', {
    title: 'Starbow',
    userId: req.user.id,
    battletag: req.user.battletag
  });
};

exports.userstuff = function(req, res){ // TODO: Temporary function for hacking away at user stuff
  if (!req.isAuthenticated()) {
    return res.send('Not authenticated');
  }
  var user = new User();
  user.findByUserId(req.user.id)
    .then(function(){
      console.log("user.getValues()", user.getValues());
      return res.send('just user stuff');
    })
    .error(function(err){
      console.log("user.findByUserId error" , req.user.id, "\n\n", err);
      return res.send("user.findByUserId error");
    });
};
