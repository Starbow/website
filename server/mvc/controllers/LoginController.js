var User = require("../models/User");

exports.index = function(req, res){
  if (!req.isAuthenticated()) {
    return res.render('login/index', {
      title: "Login",
      css: ["/assets/application/login/index.css"],
    });
  }
  var user = new User();
  user.findByUserId(req.user.id)
    .then(function(){
      return res.render('login/index/alreadyLoggedIn', {
        title: "You are already logged in",
        userProfileURL: user.getProfileURL(),
        userNickname: user.getValue("nickname")
      });
    })
    .error(function(err){
      return res.redirect('/logout?rdr=/login');
    });
};

exports.failure = function(req, res){
  return res.render('login/failure', {
    title: "Login failed",
    headMeta: [
      {name: "robots", content: "noindex,nofollow"}
    ]
  });
};
