var express = require('express');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var cookieSession = require('cookie-session');
var bodyParser = require('body-parser');
var ejs = require('ejs');

module.exports = function(app, passport) {
  app.use(express.static(process.env.ROOT + '/public'));

  // Set views path, template engine and default layout
  app.engine('html', ejs.renderFile);
  app.set('views', process.env.ROOT + '/server/mvc/views');
  app.set('view engine', 'html');

  // bodyParser should be above methodOverride
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

  // CookieParser should be above session
  app.use(cookieParser());
  app.use(cookieSession({ secret: 'cookiemonster' }));
  app.use(session({
    resave: true,
    saveUninitialized: true,
    secret: 'cookiemonster'
  }));

  // Use passport session
  app.use(passport.initialize());
  app.use(passport.session());
};
