var assert = require('chai').assert;
var expect = require('chai').expect;
var merge = require("merge");

var modelsPath = __dirname + "/../../../../../server/mvc/models"
  , bogusConfig = {
    auth: {
      bnet: {
        encryptionSalt: "encryption_salt_123"
      }
    },
    user: {
      email: {
        verificationCodeSalt: "7551d612f86269214fd94c498a47e4bf"
      }
    }
  }
  , bogusThinky = require("thinky")({db: "bogus"})
  , ConfigModel = require(modelsPath + "/ConfigModel")
  , ThinkyDocumentModel = require(modelsPath + "/ThinkyDocumentModel")
  , User;

describe("User", function(){
  before(function(done){
    var callback = function(){
      ConfigModel.init(bogusConfig);
      ThinkyDocumentModel.init(bogusThinky);
      done();
    };
    bogusThinky.r.tableList().run().then(function(tables){
      if (tables.indexOf("Users") <= -1) {
        bogusThinky.r.tableCreate("Users").run().then(function(){
          callback();
        });
      } else {
        callback();
      }
    });
  });
  after(function(done){
    bogusThinky.r.table("Users").delete().run().then(function(){
      done();
    });
  });
  beforeEach(function(done){
    bogusThinky.r.table("Users").delete().run().then(function(){
      User = require(modelsPath + "/User");
      done();
    });
  });

  describe("Saving", function(){
    describe("save()", function(){
      it("Should not be able to save invalid user", function(done){
        var user = new User();
        user
          .save()
          .error(function(err){
            expect(err).to.be.an.instanceOf(Error);
            expect(err.toString()).to.contain("Document failed validation");
            expect(user.isValid()).to.be.false;
            expect(user.existsInDatabase()).to.be.false;
            done();
          });
      });
      describe("Invalid save values", function(){
        var testCases = [
          {"value": {email: "a"},          "expected": "email"},
          {"value": {homeRegion: "bogus"}, "expected": "homeRegion"},
          {"value": {nickname: "a"},       "expected": "nickname"},
        ];
        testCases.forEach(function(testCase){
          it("Should not be able to save when value in field '" + testCase.expected + "' is invalid", function(done){
            var user = new User();
            var values = {
              userId: 1,
              oauthType: "bogus",
              oauthTokenEncrypted: "123bogus",
            };
            values = merge(testCase.value, values);
            user
              .setValues(values)
              .save()
              .error(function(err){
                expect(err).to.be.an.instanceOf(Error);
                expect(err.toString()).to.contain("Document failed validation");
                expect(err.toString()).to.contain("Validator for the field [" + testCase.expected + "] returned `false`.");
                done();
              });
          });
        });
      });
      it("Can save a valid user", function(done){
        var user = new User();
        user
          .setValues({
            userId: 1,
            oauthType: "bogus",
            oauthTokenEncrypted: "123bogus",
          })
          .save()
          .then(function(){
            assert.ok(user.isValid());
            assert.ok(user.existsInDatabase());
            assert.strictEqual(user.getValue('userId'), 1);
            assert.strictEqual(user.getValue('oauthType'), "bogus");
            assert.strictEqual(user.getValue('oauthTokenEncrypted'), "123bogus");
            expect(user.getValue('timeModified')).to.be.an.instanceOf(Date);
            done();
          });
      });
    });
  });
  describe("Finding", function(){
    describe("findByUserId()", function(){
      it("Should not be able to find a non-existant user", function(done){
        var user = new User();
        user
          .findByUserId(1)
          .error(function(err){
            expect(err).to.be.an.instanceOf(Error);
            expect(err.toString()).to.contain("Document not found");
            expect(user.isValid()).to.be.false;
            expect(user.existsInDatabase()).to.be.false;
            assert.typeOf(user.getValues(), "object", "Object should contain default values");
            done();
          });
      });
      it("Should be able to find an existing user", function(done){
        var user = new User();
        user
          .setValues({
            userId: 1,
            oauthType: "bogus",
            oauthTokenEncrypted: "123bogus",
          })
          .save()
          .then(function(){
            var subUser = new User();
            subUser
              .findByUserId(1)
              .then(function(){
                done();
              });
          });
      });
    });
    describe("findByEmail()", function(){
      it("Should be able to find a user by email address", function(done){
        var user = new User();
        user
          .setValues({
            userId: 1,
            oauthType: "bogus",
            oauthTokenEncrypted: "123bogus",
            email: "foo@bar.com"
          })
          .save()
          .then(function(){
            var subUser = new User();
            subUser
              .findByEmail("foo@bar.com")
              .then(function(){
                assert.equal(user.getValue("userId"), 1);
                assert.equal(user.getValue("email"), "foo@bar.com");
                done();
              });
          });
      });
    });
    describe("findByEmailVerificationCode()", function(){
      it("Should be able to find a user by email verification code", function(done){
        var user = new User();
        user
          .setValues({
            userId: 1,
            oauthType: "bogus",
            oauthTokenEncrypted: "123bogus",
            email: "foo@bar.com",
            emailVerificationCode: "a8f5f167f44f4964e6c998dee827110c"
          })
          .save()
          .then(function(){
            var subUser = new User();
            subUser
              .findByEmailVerificationCode("a8f5f167f44f4964e6c998dee827110c")
              .then(function(){
                assert.equal(user.getValue("userId"), 1);
                assert.equal(user.getValue("email"), "foo@bar.com");
                done();
              });
          });
      });
    });
  });
  describe("encryptOauthToken()", function(){
    it("Throws 'TypeError' when parameter is not a String", function(){
      var user = new User();
      assert.throw(function(){user.encryptOauthToken(undefined)}, TypeError);
    });
    it("Can encrypt oauth token correctly", function(){
      var user = new User();
      var encryptedToken = user.encryptOauthToken("my_little_oauth_token");
      assert.strictEqual(encryptedToken, "41a65d5a9d2156f20daff6add137ea3465854d5c3c262ddb52ae64251d7a9d9e");
    });
  });
  describe("decryptOauthToken()", function(){
    it("Throws 'TypeError' when parameter is not a String", function(){
      var user = new User();
      assert.throw(function(){user.decryptOauthToken(undefined)}, TypeError);
    });
    it("Can decrypt oauth token correctly", function(){
      var user = new User();
      var encryptedToken = "41a65d5a9d2156f20daff6add137ea3465854d5c3c262ddb52ae64251d7a9d9e";
      var token = user.decryptOauthToken(encryptedToken);
      assert.strictEqual(token, "my_little_oauth_token");
    });
  });
  describe("generateEmailVerificationCode()", function(){
    it("Will fail if user does not exist in database", function(){
      var user = new User();
      assert.throw(function(){user.generateEmailVerificationCode()}, Error);
    });
    it("Will generate a unique verification code", function(done){
      var user = new User();
      user
        .setValues({
          userId: 1,
          oauthType: "bogus",
          oauthTokenEncrypted: "123bogus",
        })
        .save()
        .then(function(){
          var expected = "646df13627734b1f8a319a11e1c759be42a72cecd52ea57419cb22448db4ba61";
          assert.strictEqual(user.generateEmailVerificationCode(), expected);
          done();
        });
    });
  });
  describe("validateEmailVerificationCode()", function(){
    it("Will fail if user does not exist in database", function(){
      var user = new User();
      assert.throw(function(){user.validateEmailVerificationCode("123")}, Error);
    });
    it("Will validate input code against a generated verification code", function(){
      var user = new User();
      user.setValues({
        userId: 1,
        oauthType: "bogus",
        oauthTokenEncrypted: "123bogus",
      });
      assert.ok(user.validateEmailVerificationCode("646df13627734b1f8a319a11e1c759be42a72cecd52ea57419cb22448db4ba61"));
      expect(user.validateEmailVerificationCode("_646df13627734b1f8a319a11e1c759be42a72cecd52ea57419cb22448db4ba61")).to.be.false;
    });
  });
  describe("hasHomeRegion()", function(){
    it("Should not have a home region for a default/invalid user", function(){
      var user = new User();
      expect(user.hasHomeRegion()).to.be.false;
    });
    it("Should have a home region for a valid user", function(){
      var user = new User();
      user.setValues({
        userId: 1,
        oauthType: "bogus",
        oauthTokenEncrypted: "123bogus",
        homeRegion: "us"
      });
      assert.ok(user.hasHomeRegion());
    });
  });
  describe("hasNickname()", function(){
    it("Should not have a nickname for a default/invalid user", function(){
      var user = new User();
      expect(user.hasNickname()).to.be.false;
    });
    it("Should have a home region for a valid user", function(){
      var user = new User();
      user.setValues({
        userId: 1,
        oauthType: "bogus",
        oauthTokenEncrypted: "123bogus",
        nickname: "bogus"
      });
      assert.ok(user.hasNickname());
    });
  });
  describe("isEmailVerified()", function(){
    it("Should throw an error when user is invalid", function(){
      var user = new User();
      assert.throws(function(){
        user.isEmailVerified();
      }, Error, /guardExistsInDatabase/)
    });
    it("Should return false when 'emailVerificationTime' is null", function(done){
      var user = new User();
      user
        .setValues({
          userId: 1,
          oauthType: "bogus",
          oauthTokenEncrypted: "123bogus",
          emailVerificationTime: null
        })
        .save()
        .then(function(){
          expect(user.isEmailVerified()).to.be.false;
          done();
        });
    });
    it("Should return true when 'emailVerificationTime' is a Date", function(done){
      var user = new User();
      user
        .setValues({
          userId: 1,
          oauthType: "bogus",
          oauthTokenEncrypted: "123bogus",
          emailVerificationTime: new Date()
        })
        .save()
        .then(function(){
          assert.ok(user.isEmailVerified());
          done();
        });
    });
  });
  describe("isRegistrationComplete()", function(){
    it("Should throw an error when user is invalid", function(){
      var user = new User();
      assert.throws(function(){
        user.isRegistrationComplete();
      }, Error, /guardExistsInDatabase/)
    });
    it("Should return true when 'hasHomeRegion', 'hasNickname', and 'isEmailVerified' all return true", function(done){
      var user = new User();
      user
        .setValues({
          userId: 1,
          oauthType: "bogus",
          oauthTokenEncrypted: "123bogus",
          homeRegion: "us",
          nickname: "bogus",
          emailVerificationTime: new Date()
        })
        .save()
        .then(function(){
          assert.ok(user.isRegistrationComplete());
          done();
        });
    });
  });
});
