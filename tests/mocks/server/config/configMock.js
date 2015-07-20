var config = {
  auth: {
    bnet: {
      clientID: 42,
      clientSecret: "adsadsa12321321",
      callbackURL: "/auth/bnet/callback",
      scope: "sc2.profile",
      encryptionSalt: "encryption_salt_123"
    }
  },
  db: {
    thinky: {
      db: "bogus"
    }
  },
  log: {
    access: { // morgan
      format: "short",
      options: {
        stream: "access.log"
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
        filename: "cluster.log",
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
        filename: "framework.log",
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
        filename: "mvc.log",
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
      verificationCodeSalt: "7551d612f86269214fd94c498a47e4bf"
    }
  }
};

Object.freeze(config);

module.exports = config;
