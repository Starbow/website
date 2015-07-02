var bnet = require('battlenet-api')(process.env.BNET_ID);
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
      var oauthTokenEncryptionSalt = process.env.BNET_OAUTH_TOKEN_ENCRYPTION_SALT;
      var oauthToken = user.decryptOauthToken(user.getValue('oauthTokenEncrypted'), oauthTokenEncryptionSalt);
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
  /*
  Hard coded. Request works.
  var bnetData  = null;
  bnet.sc2.profile.matchHistory({origin: 'eu', id: 211720, region: 1, name: "Nightseer"}, function(bnetErr, bnetResp){
    bnetData = bnetResp;
    console.log('roundtrip complete', JSON.stringify(bnetErr), JSON.stringify(bnetResp));
    res.send(JSON.stringify(bnetData));
  });*/
};
