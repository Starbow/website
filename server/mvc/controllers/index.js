exports.index = function(req, res){
  if(req.isAuthenticated()) {
    res.render('indexAuthenticated', {
      title: 'Starbow Bnet',
      userId: req.user.id,
      battletag: req.user.battletag
    });
  } else {
    res.render('index', {
      title: 'Starbow Bnet'
    });
  }
};
