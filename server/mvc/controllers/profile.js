var session = require('express-session');
var bnet = require('battlenet-api')(process.env.BNET_ID);

exports.info = function(req, res){
  if(!req.isAuthenticated()) {
    res.redirect('/');
    return;
  }
  /*
  TODO: Implement using "Models.User"
  bnet.account.sc2({origin: 'eu', access_token: session.OAuthAccessToken}, function(bnetErr, bnetResp){
    res.send(JSON.stringify(bnetResp));
  });*/
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
