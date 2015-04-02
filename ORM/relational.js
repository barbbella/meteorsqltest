/**
 * Created by ppp on 4/2/2015.
 */
var pg = require('pg');
var conString = 'postgres://vvafxtcxuwwrzw:xH-VdFtOapbhMzJRCwN2gCvUGZ@ec2-107-22-173-230.compute-1.amazonaws.com:5432/dbqqasbfcvstcc/user';

var createTable = function(name) {
  pg.connect(conString, function(err, client, done) {
    console.log(err);
    var create = 'CREATE TABLE $1 (id serial primary key not null, )';

    client.query(create, ["paulo"], function(error, results) {
      console.log("error in inserts", error);
      console.log("results in inserts", results);
      done();
    });
  });
};

var db = {};
// object = {field name: data types, constraint}
//
/**
 * TODO: add relationships? helper tables? triggers?
 * @param name
 * @param {object} [options]
 * @param {columnNames} object.columnNames
 * @param {groupBy}  object.groupBy
 * @param {limit}  object.limit
 * @param {offset}  object.offset
 */
db.prototype.createTable = function(name, object){
  var id = object.id || 'id serial primary key not null';
  var initString = 'CREATE TABLE ' + name + '( ' + object.id;
  var fieldArray = [];
  for (var key in object) {
    // CREATE TABLE $1 (id serial primary key not null, field_name data_type constraint
    initString += ', ' + key + ' ' + object[key][0] + ' ' + object[key][1];
  }
  // closes string
  initString +=  ');';
  // node postgres connection/query function
  pg.connect(conString, function(err, client, done) {
    console.log(err);
    client.query(initString, function(error, results) {
      console.log("error in create table " + name, error);
      console.log("results in create table " + name, results);
      done();
    });
  });
};

/**
 * TODO: Add joins
 * @param name
 * @param {object} [options]
 * @param {columnNames} object.columnNames
 * @param {groupBy}  object.groupBy
 * @param {limit}  object.limit
 * @param {offset}  object.offset
 */
db.prototype.select = function(name, object) {
  // 'SELECT data FROM table WHERE parameters GROUP BY LIMIT OFFSET'
  // data parameters options (name directly passed in)
  var columnNames = object.columnNames || '*';
  var groupBy = ' GROUP BY '+object.groupBy || '';
  var limit = ' LIMIT '+object.limit || '';
  var offset = ' OFFSET '+object.offset || '';
  var initString = 'SELECT ' + columnNames + ' FROM ' + name + groupBy + limit + offset + ');';
  pg.connect(conString, function(err, client, done) {
    console.log(err);
    client.query(initString, function(error, results) {
      console.log("error in select " + name, error);
      console.log("results in select " + name, results);
      done();
    });
  });
};