/*
USAGE:
var db = require('./db');
db.connect(cb);
db.query('SELECT * from `rosters`', function(err,recordset) )
*/

var mysql2 = require('mysql2');
var SSH2Client = require('ssh2').Client;

var sshConf = {
  host: process.env.SSH_HOST,
  port: process.env.SSH_PORT,
  username: process.env.SSH_USER,
  password: process.env.SSH_PASS,
};
var sqlConf = {
  user: process.env.SQL_USER,
  password: process.env.SQL_PASS,
  database: process.env.SQL_DB
};

var state = {
  db:null
}

exports.connect = (cb) => {
  if(state.db) return cb()

  var ssh = new SSH2Client();
  ssh.on('ready', function() {
    ssh.forwardOut(
      '127.0.0.1',
      24000,
      process.env.DEST_IP,
      3306,
      function(err, stream) {
        if (err) return cb(err);
        sqlConf.stream = stream;
        state.db = mysql2.createConnection(sqlConf)
        cb();
      }
    );
  });
  ssh.connect(sshConf);
}

exports.query = (queryString, cb) => {
  state.db.query(queryString, cb);
}


exports.asyncQuery = (queryString, values = []) => {
  return new Promise((resolve) => {
    state.db.query(queryString, values, (error, result) => {
      if(error) {
        resolve({
          error:{
            code:error.code,
            message:error.sqlMessage
          }
        });
      }
      else resolve({result});
    });
  })
}
