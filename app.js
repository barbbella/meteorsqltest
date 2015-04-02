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
var conString = 'postgres://postgres:1234@localhost/dvdrental';
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

var createIndex = function (){
  pg.connect(conString, function(err, client, done) {
    console.log(err);
    var film = "create index on film_docs using GIN(data)";
    client.query(film, function(error, results) {
      console.log(results);
      done();
      callback(null);
    });
  });
};


var insert = function(callback) {
  pg.connect(conString, function(err, client, done) {
    console.log(err);
    var film = {"title": "Test Italian", "length": 117, "rating": "NC-17", "film_id": 133, "fulltext": "'chamber':1 'fate':4 'husband':11 'italian':2 'monkey':16 'moos':8 'must':13 'nigeria':18 'overcom':14 'reflect':5", "description": "A Fateful Reflection of a Moose And a Husband who must Overcome a Monkey in Nigeria", "language_id": 1, "last_update": "2013-05-26T14:50:58.951", "rental_rate": 4.99, "release_year": 2006, "rental_duration": 7, "replacement_cost": 14.99, "special_features": ["Trailers"]};
    var insert = 'INSERT INTO film_docs (data) values ($1)';
    client.query(insert, [film], function(error, results) {
      console.log("error in inserts", error);
      console.log("results in inserts", results);
      done();
      callback(null);
    });
  });
};

var find = function(element, callback) {
  pg.connect(conString, function(err, client, done){
    console.log(err);
    //console.log(client, 1234);
    var element = {title: "Test Italian"};
    var find = "SELECT (data ->> 'title') as Title, (data -> 'length') as Length FROM film_docs WHERE data @> $1";
    client.query(find, [element], function(error, results) {
      console.log("find results", results);
      console.log("find error", error);
      //console.log(results);
      done();
      callback(null);
    });
  });
};

var update = function(callback) {
  pg.connect(conString, function(err, client, done){
    console.log(err);
    var data = {title: "Chamber Italian"};
    var newdata = {"title": "Test test", "length": 117, "rating": "NC-17", "film_id": 133, "fulltext": "'chamber':1 'fate':4 'husband':11 'italian':2 'monkey':16 'moos':8 'must':13 'nigeria':18 'overcom':14 'reflect':5", "description": "A Fateful Reflection of a Moose And a Husband who must Overcome a Monkey in Nigeria", "language_id": 1, "last_update": "2013-05-26T14:50:58.951", "rental_rate": 4.99, "release_year": 2006, "rental_duration": 7, "replacement_cost": 14.99, "special_features": ["Trailers"]};
    var update = "update film_docs set data = $1 where data @> $2";
    client.query(update, [data], function(error, results){
      console.log("error in update", error);
      console.log("error in results", results);
      done();
      callback(null);
    })
  })
};



//var userArray = [];
//var find = function(callback) {
//  pg.connect(conString, function(err, client, done){
//  console.log(err);
//    //console.log(client, 1234);
//    var find = 'SELECT film_id, title from film limit 100';
//    client.query(find, function(error, results) {
//      console.log(results);
//      //console.log(results);
//      for (var x = 0, count = results.rows.length; x < count; x++) {
//        userArray.push(new film(results.rows[x].film_id, results.rows[x].title));
//      }
//      done();
//      callback(null);
//    });
//  });
//};

async.series([
  //function(callback){
  //  insert(callback);
  //},
  function(callback){
    find("hello", callback);
  },
  function(callback){
    update(callback);
  }
]);
//find('film_id', 'title');
//console.log(userArray);

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