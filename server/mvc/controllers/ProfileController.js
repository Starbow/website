var Models = require('../models.js');

exports.info = function(req, res){
  if(!req.isAuthenticated()) {
    res.redirect('/');
    return;
  }
  var user = new Models.User();
  user
    .findByUserId(req.user.id)
    .then(function(){
      if (!user.exists()) {
        throw new Error('User does not exit');
      }
      var oauthToken = user.decryptOauthToken(user.getValue('oauthTokenEncrypted'));
      var battlenet = new Models.Battlenet();
      var bnet = require('battlenet-api')(battlenet.getClientId());
      bnet.account.sc2({origin: 'eu', access_token: oauthToken}, function(bnetErr, bnetResp){
        res.send(JSON.stringify(bnetResp));
      });
    })
    .error(function(err){

    });
};

exports.matchhistory = function(req, res){
  if(!req.isAuthenticated()) {
    res.redirect('/');
    return;
  }
  res.send("Nothing to see here. Move along.");
};
