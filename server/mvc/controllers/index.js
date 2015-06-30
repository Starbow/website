exports.index = function(req, res){
  if(req.isAuthenticated()) {
    res.render('indexAuthenticated', {
      title: 'Starbow',
      userId: req.user.id,
      battletag: req.user.battletag
    });
  } else {
    res.render('index', {
      title: 'Starbow'
    });
  }
};

exports.userstuff = function(req, res){ // TODO: Temporary function for hacking away at user stuff
  var user = new Models.User;
  user.findByUserId(req.user.id)
    .then(function(){
      console.log("user.getValues()", user.getValues());
    })
    .error(function(err){
      console.log("user.findByUserId error", err);
    });
  res.send('just user stuff');
};
