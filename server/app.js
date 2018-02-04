
// Express used for routing
const express = require('express');
const path = require('path');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const session = require('express-session');
const dotenv = require('dotenv');

// Passport for auth0 
const passport = require('passport');
const Auth0Strategy = require('passport-auth0');

// Mongo for db for now
const mongo = require('mongodb');
const mongoose = require('mongoose');
const db = mongoose.connection;

// Load env variables
dotenv.load();

// Connect mongoose
mongoose.connect(process.env.MONGODB_URI);

// Pull in routes
const routes = require('./routes/index');

// Configure Passport
var strategy = new Auth0Strategy(
  {
    domain: process.env.AUTH0_DOMAIN,
    clientID: process.env.AUTH0_CLIENT_ID,
    clientSecret: process.env.AUTH0_CLIENT_SECRET,
    callbackURL: 'http://localhost:3000/callback'
  },
  (accessToken, refreshToken, extraParams, profile, done) => {
    return done(null, profile);
  }
);

// Tell passport to use this strategy
passport.use(strategy);

// Serialize and deserialize methods
passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

// Instantiate express
const app = express();

// Set views directory and views engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Middleware

// Logging
app.use(logger('dev'));

// Body, cookies, session parsing
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
  secret: 'shhhhhh', // TODO: update
  resave: true,
  saveUninitialized: true,
}));

// Passport things
app.use(passport.initialize());
app.use(passport.session());

// Public directory
app.use(express.static(path.join(__dirname, 'public')));


// Tie in routes
app.use('/', routes);

// Catch 404s
app.use((req, res, next) => {
  let err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// Display any errors
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: err
  });
});

const PORT = 3000;

app.listen(3000, () => {
  console.log(`Listening on port ${PORT}`);
});
