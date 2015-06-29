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
  if(req.isAuthenticated()) {
    var user = new Models.User;
    user.findByUserId(req.user.id, function(err, userData){
      console.log('user.getObjectName()', user.getObjectName(), userData);
      res.send('See output in terminal');
    });
  } else {
    res.redirect('/');
    return;
  }
};
