var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
var session = require('express-session');
var fileStore = require('session-file-store')(session);
var passport = require('passport');
var authenticate = require('./authenticate');
var config = require('./config');


// J'importe le schema dishes
const Dishes = require('./models/dishes');

// Je me connecte a la base de données
const url = config.mongoUrl;
const connect = mongoose.connect(url, { useCreateIndex: true, useNewUrlParser: true });

connect.then((db) =>{
  console.log("Connected correctly to server");
}, 
  (err) => { 
  console.log(err); 
});

// Je recupére les routes crées
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var dishRouter = require('./routes/dishRouter');
var promoRouter = require('./routes/promoRouter');
var leaderRouter = require('./routes/leaderRouter');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser('12345-67890-09876-54321'));

// On utilise express-session
app.use(session({
  name: 'session-id',
  secret: '12345-67890-09876-54321',
  saveUninitialized: false,
  resave: false,
  store: new fileStore()
}));

app.use(passport.initialize());
app.use(passport.session());

app.use('/', indexRouter);
app.use('/users', usersRouter);

// Je securise mon serveur avec l'authentification basic d'express------------------------------
function auth (req, res, next) {
  console.log(req.user);

  // Si l'user n'est pas authentifié:
  if(!req.user) {
    var err = new Error('You are not authenticated!');
    err.status = 403;
    next(err);
}

else {
    next();
  }

}

app.use(auth);
// -------------------------------------------------------------------

app.use(express.static(path.join(__dirname, 'public')));

// J'ultilise les routes avec les chemins correspondants

app.use('/dishes', dishRouter);
app.use('/promotions', promoRouter);
app.use('/leaders', leaderRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
