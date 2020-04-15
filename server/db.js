/*
USAGE:
var db = require('./db');
db.connect(cb);
db.query('SELECT * from `rosters`', function(err,recordset) )
*/

const iError = require('helpers/iError');
var mysql2 = require('mysql2');

var sqlConf = {
  host:'localhost',
  user: process.env.SQL_USER,
  password: process.env.SQL_PASS,
  database: process.env.SQL_DB,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

var state = {
  db:null
}

exports.connect = (cb) => {
  if(!state.db) {
    state.db = mysql2.createPool(sqlConf);
  }
  cb();
}

exports.query = (queryString, cb) => {
  console.log(queryString)
  state.db.query(queryString, cb);
}

exports.asyncQuery = (queryString, values = []) => {
  return new Promise((resolve) => {
    state.db.query(queryString, values, (error, result) => {
      if(error) {
        resolve(new iError('DB_ERROR', error.sqlMessage,500));
      }
      else resolve(result);
    });
  })
}
