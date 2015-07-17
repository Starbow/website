var BattlenetUser = require("../models/User/BattlenetUser");

exports.info = function(req, res){
  if(!req.isAuthenticated()) {
    res.redirect('/');
    return;
  }
  var battlenetUser = new BattlenetUser;
  battlenetUser
    .findByUserId(req.user.id)
    .then(function(){
      battlenetUser
        .fetchSC2InfoByRegion('eu')
        .then(function(info){
          res.send(JSON.stringify(info));
        })
        .error(function(){
          throw new Error('User does not exist 2');
        });
    })
    .error(function(err){
      throw new Error('User does not exist 1');
    });
};

exports.matchhistory = function(req, res){
  if(!req.isAuthenticated()) {
    res.redirect('/');
    return;
  }
  res.send("Nothing to see here. Move along.");
};
