var User = require(process.env.ROOT + "/server/mvc/models/User");

module.exports = function(req, res, next){
  var notFound = function(){
    res.status(404).render('../error/404', {
      url: req.originalUrl,
      error: 'Not found'
    });
  };
  if (!req.isAuthenticated()) {
    return notFound();
  }
  var user = new User();
  user
   .findByUserId(req.user.id)
   .then(function(){
     if (user.isAdmin()) {
       return next();
     }
     return notFound();
   })
   .error(function(err){
     return notFound();
   });
};
