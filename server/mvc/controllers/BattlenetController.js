var BattlenetUser = require("../models/User/BattlenetUser");
var Promise = require("bluebird");
var RegionProfile = require(process.env.ROOT + "/server/mvc/models/RegionProfile");

var region = [
  'eu',
  'us'
]

exports.index = function(req, res){
  if(!req.isAuthenticated()) {
    res.redirect('/');
    return;
  }

// TODO: use fetchSC2InfoByRegion to pull in bnet data for storage

  res.redirect('/');
};
