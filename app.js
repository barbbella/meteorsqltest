var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var routes = require('./routes/index');
var users = require('./routes/users');
var pg = require('pg');
var async = require('async');
var conString = 'postgres://postgres:1324@localhost/dvdrental';
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');


// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

var film = function(id, title) {
  this.id = id;
  this.title = title;
};


var insert = function() {
  console.log('got into insertMessagesFromTrees is ');
  // console.log(treeid, userid, message);
  pg.connect(conString, function(err, client, done) {
    // console.log(err);
    var selectMessages = 'INSERT INTO message (message, treeid, userid, createdat) values($1, $2, $3, now())';
    client.query(selectMessages, [message, treeid, userid], function(error, results) {
      // console.log('results is ', results);
      res.send(results);
      done();
    });
  });
};


var find = function(item1, item2, item3) {
  var userArray = [];
  pg.connect(conString, function(err, client, done){
  console.log(err);
    var find = 'SELECT $1, $2 from $3';
    client.query(find, [item1, item2, item3], function(error, results) {
      for (var x = 0, count = results.rows; x < count; x++) {
        userArray.push(new film(results.rows[x].film_id, results.rows[x].title));
      }
      return userArray;
      done();
    });
  });
};

console.log(find());

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
