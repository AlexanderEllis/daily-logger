// Import libraries
const express = require('express');
const passport = require('passport');
let router = express.Router();
const ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn();
var request = require('request');

// env variables
const env = {
  AUTH0_CLIENT_ID: process.env.AUTH0_CLIENT_ID,
  AUTH0_DOMAIN: process.env.AUTH0_DOMAIN,
  AUTH0_CALLBACK_URL: 'http://localhost:3000/callback'
};

router.get('/', (req, res, next) => {
  const user = req.user;
  console.log(user);
  res.render('index', { env, user});
});

// Simple route for logging in
router.get('/login', (req, res) => {
  res.render('login', { env });
});

// Simple route for logging out
router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

// Callback from auth0
router.get('/callback',
  passport.authenticate('auth0', { failureRedirect: '/' }),
  (req, res) => {
    res.redirect(req.session.returnTo || '/');
  }
);

// Define export
module.exports = router;
