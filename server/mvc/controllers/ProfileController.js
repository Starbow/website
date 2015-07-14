var User = require("../models/User");
var Battlenet = require("../models/Battlenet");

exports.info = function(req, res){
  if(!req.isAuthenticated()) {
    res.redirect('/');
    return;
  }
  var user = new User();
  user
    .findByUserId(req.user.id)
    .then(function(){
      if (!user.validateExistsInDatabase()) {
        throw new Error('User does not exit');
      }
      var oauthToken = user.decryptOauthToken(user.getValue('oauthTokenEncrypted'));
      var bnet = require('battlenet-api')(Battlenet.getClientId());
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
