var flashs = require('req-flash');
var flash = require('connect-flash');
//utils = require('./utils');
// var LocalStrategy = require('passport-local').Strategy;
var express = require('express');
var multer = require('multer');
var expressLayouts = require('express-ejs-layouts');
var session = require('express-session');
var app = express();
var mongodb = require('mongodb');
var mongodbCore = require('mongodb-core');
var passportLocal = require('passport-local');
var path = require('path');
var git = require('git');
expressValidator = require('express-validator');
var passport = require('passport');
var port = process.env.PORT || 3000;
var configDB = require('./config/database.js');
var mongoose = require('mongoose');
var favicon = require('serve-favicon');
var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
 var passwordHash = require('password-hash');
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(expressLayouts);

app.use(expressValidator());
app.set('layout', 'layouts/default');
// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(bodyParser.urlencoded({
    extended: true
}));
 
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser());
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
    cookie: {
        //maxAge: 60000
expires: new Date(Date.now() + 60 * 10000), 
  maxAge: 60*10000
    },
    secret: 'ilovescotchscotchyscotchscotch'
})); // session secret
app.use(flash()); // use connect-flash for flash messages stored in session
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
//app.use(passport.authenticate('remember-me'));


app.use(function (req, res, next) {
  res.locals.login = req.isAuthenticated();

  next();
});

var index = require('./routes/index');
var users = require('./routes/users');

app.use('/', index);
app.use('/users', users);


mongoose.connect(configDB.url); // connect to our database
require('./app/routes.js')(app, passport);
require('./controllers/admin.js')(app, passport);
require('./controllers/user.js')(app, passport);
require('./config/passport')(passport);
mongoose.connection.on('error', console.error.bind(console, 'connection error:'));
mongoose.connection.once('open', function() {
    console.log("Mongo DB connected!");
});



// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
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
app.listen(port);
module.exports = app;
console.log('The magic happens on port ' + port);
/*********end of start*****/


if (typeof(window) !== 'undefined') {
    var timer = setTimeout(function() {
        // code here
    }, 200);
}