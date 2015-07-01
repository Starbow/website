var Models = require('../models.js');

exports.index = function(req, res){
  if(!req.isAuthenticated()) {
    return res.render('index', {
      title: 'Starbow'
    });
  }
  res.render('indexAuthenticated', {
    title: 'Starbow',
    userId: req.user.id,
    battletag: req.user.battletag
  });
};

exports.userstuff = function(req, res){ // TODO: Temporary function for hacking away at user stuff
  if (!req.isAuthenticated()) {
    return res.send('Not authenticated');
  }
  var user = new Models.User();
  user.findByUserId(req.user.id)
    .then(function(){
      console.log("user.getValues()", user.getValues());
    })
    .error(function(err){
      console.log("user.findByUserId error", err);
    });
  res.send('just user stuff');
};
