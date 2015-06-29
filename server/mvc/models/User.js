var _rethinkdb,
    _name = module.filename.slice(module.filename.lastIndexOf('/')+1, module.filename.length).replace(/\.(.*?)$/, '');

Models.User = function(){
  var rethinkdb = _rethinkdb;
  var name = _name;
  var dbContents = null;

  this.findByUserId = function(userId, callback){
    dbContents = null;
    console.log("User.findByUserId("+userId+")");
    onConnect(function(err, connection){
      rethinkdb
        .db(process.env.DB_NAME)
        .table('users')
        .filter({"userId":userId})
        .limit(1)
        .run(connection)
        .then(function(result){
          dbContents = result;
        })
        .error(function(err){
          logerror("[ERROR][%s][findUserById] %s:%s\n%s", connection['_id'], err.name, err.msg, err.message);
        })
        .finally(function(){
          connection.close();
          callback(null, dbContents);
        });
    });
  };
  this.getObjectName = function(){
    return name;
  };
  this.isValid = function(){
    return (typeof(dbContents) == 'object' && dbContents !== null);
  };
};

module.exports = function(rethinkdb) {
  _rethinkdb = rethinkdb;
};
