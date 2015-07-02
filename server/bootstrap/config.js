var fs = require("fs");
var sprintf = require("sprintf-js").sprintf;

var config = {
  auth: {
    bnet: {
      clientID: process.env.BNET_ID,
      clientSecret: process.env.BNET_SECRET,
      callbackURL: "/auth/bnet/callback",
      scope: "sc2.profile",
      encryptionSalt: process.env.BNET_OAUTH_TOKEN_ENCRYPTION_SALT
    }
  },
  db: {
    thinky: {
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT),
      db: process.env.DB_NAME
    }
  },
  log: {
    access: {
      format: "tiny",
      options: {
        stream: "access.log"
      }
    },
    error: {
      format: process.env.LOG_ERROR_FORMAT,
      options: {
        stream: "error.log"
      }
    }
  }
};

Object.freeze(config);

module.exports = config;
