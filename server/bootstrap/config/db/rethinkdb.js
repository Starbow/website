var dbConfig = {
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT),
  db: process.env.DB_NAME
};

module.exports.config = function(){
  return dbConfig;
};
