require("./env/env.js");

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
    access: { // morgan
      format: "short",
      options: {
        stream: process.env.LOG_ACCESS_FILE
      }
    },
    cluster: {
      console: {
        level: 'debug',
        handleExceptions: true,
        json: false,
        colorize: true
      },
      file: {
        level: 'debug',
        filename: process.env.LOG_CLUSTER_FILE,
        handleExceptions: true,
        json: false,
        maxsize: 5242880, //5MB
        maxFiles: 5,
        colorize: false
      }
    },
    framework: { // winston
      console: {
        level: 'debug',
        handleExceptions: true,
        json: false,
        colorize: true
      },
      file: {
        level: 'debug',
        filename: process.env.LOG_FRAMEWORK_FILE,
        handleExceptions: true,
        json: false,
        maxsize: 5242880, //5MB
        maxFiles: 5,
        colorize: false
      }
    },
    mvc: { // winston
      console: {
        level: 'debug',
        handleExceptions: true,
        json: false,
        colorize: true
      },
      file: {
        level: 'debug',
        filename: process.env.LOG_MVC_FILE,
        handleExceptions: true,
        json: false,
        maxsize: 5242880, //5MB
        maxFiles: 5,
        colorize: false
      }
    }
  },
  user: {
    email: {
      verificationCodeSalt: process.env.USER_EMAIL_VERIFICATION_CODE_SALT
    }
  }
};

Object.freeze(config);

module.exports = function(){
  /**
   * HERE BE DRAGONS!
   * Overrides the current function with a failsafe.
   */
  module.exports = function(){
    throw new Error("Please don't reference \"config.js\" anywhere; it should only only be run once - in boostrap!");
  };
  return config;
};
