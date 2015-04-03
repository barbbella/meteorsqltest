/**
 * Created by ppp on 4/2/2015.
 */
var pg = require('pg');
var conString = 'postgres://postgres:1234@localhost/postgres';

var db = {};
/**
 * TODO: add relationships? helper tables? triggers? add password and id field datatypes
 * @param name
 * @param {object} [options]
 * @param {dataType} object.field[0]
 * @param {constraint} object.field.dataType
 */
db.createTable = function(name, object) {
  var id = object.id || 'id serial primary key not null';
  var initString = 'CREATE TABLE ' + name + '( ' + id;
  var fieldArray = [];
  for (var key in object) {
    // CREATE TABLE $1 (id serial primary key not null, field_name data_type constraint
    initString += ', ' + key + ' ' + object[key][0] + ' ' + object[key][1];
  }
  // closes string
  initString += ", created_at TIMESTAMPTZ default now());";
  // node postgres connection/query function
  console.log(initString);
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
db.select = function(name, object) {
  // 'SELECT data FROM table WHERE parameters GROUP BY LIMIT OFFSET'
  // data parameters options (name directly passed in)
  var columnNames = object.columnNames || '*';
  var groupBy =  object.groupBy ? ' GROUP BY ' + object.groupBy : '';
  var limit = object.limit ? ' LIMIT ' + object.limit : '';
  var offset = object.offset ? ' OFFSET ' + object.offset : '';
  var initString = 'SELECT ' + columnNames + ' FROM ' + name + groupBy + limit + offset + ';';
  console.log(initString);
  pg.connect(conString, function(err, client, done) {
    console.log(err);
    client.query(initString, function(error, results) {
      console.log("error in select " + name, error);
      console.log("results in select " + name, results.rows);
      done();
    });
  });
};

/**
 * TODO:
 * @param {string} name
 * @param {array} fieldNames
 * @param {array} values
 */
db.insert = function(name, fieldNames, values) {
  // 'INSERT INTO table (fields) VALUES (values);'
  // data parameters options (name directly passed in)
  var initString = 'INSERT INTO ' + name + ' (';
  var valueString = ') VALUES (';
  for (var i = 0, count = fieldNames.length - 1; i < count;) {
    initString += fieldNames[i] + ', ';
    valueString += '$' + (++i) + ', ';
  }
  // 'INSERT INTO ' + name + ' (' + fieldNames
  initString += fieldNames[fieldNames.length - 1] + valueString + '$' + fieldNames.length + ');';
  pg.connect(conString, function(err, client, done) {
    console.log(err);
    client.query(initString, values, function(error, results) {
      console.log("error in insert " + name, error);
      console.log("results in insert " + name, results);
      done();
    });
  });
};

/**
 * TODO: update
 * @param {string} name
 * @param {array} fieldNames
 * @param {array} values
 * @param {object} where
 * @param {conditionalString} object.fieldNames
 */
// where = { fieldName: conditionalString } truthy value?
db.update = function(name, fieldNames, values, where) {
  // 'UPDATE table SET fieldName  = value WHERE parameters;'
  var initString = 'UPDATE ' + name + ' SET '; // field names
  var valueString = ' = '; // where params
  var whereString = 'WHERE ';
  for (var i = 0, count = fieldNames.length - 1; i < count;) {
    initString += fieldNames[i] + ', ';
    valueString += '$' + (++i) + ', ';
  }
  for (var field in where) {
    whereString += field + where[field] + ', ';
  }
  whereString = whereString.substring(0, whereString.length - 2);
  // 'INSERT INTO ' + name + ' (' + fieldNames
  initString += fieldNames[fieldNames.length - 1] + valueString + '$' + fieldNames.length + ' ' + whereString + ';';
  console.log(initString);
  pg.connect(conString, function(err, client, done) {
    console.log(err);
    client.query(initString, values, function(error, results) {
      console.log("error in insert " + name, error);
      console.log("results in insert " + name, results);
      done();
    });
  });
};

module.exports = db;