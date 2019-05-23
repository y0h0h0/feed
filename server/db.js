/*
USAGE:
var db = require('./db');
db.connect(cb);
db.query('SELECT * from `rosters`', function(err,recordset) )
*/

const iError = require('helpers/iError');
var mysql2 = require('mysql2');
// var SSH2Client = require('ssh2').Client;

var sshConf = {
  host: process.env.SSH_HOST,
  port: process.env.SSH_PORT,
  username: process.env.SSH_USER,
  password: process.env.SSH_PASS,
  // keepaliveInterval:120000
};
var sqlConf = {
  user: process.env.SQL_USER,
  password: process.env.SQL_PASS,
  database: process.env.SQL_DB,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

var state = {
  db:null,
  ssh:null
}





exports.connect = (cb) => {
  if(!state.db) {
    state.db = mysql2.createPool(sqlConf);
  }
  cb();
}

//
// exports.connect = (cb) => {
//   if(state.db) return cb()
//
//   var ssh = new SSH2Client();
//   ssh.on('ready', function() {
//     state.ssh = ssh;
//     console.log(' ')
//     console.log(' ')
//     console.log(' ')
//     console.log(' ')
//     console.log('>> SSH >> ', new Date(), ' Connection opened');
//     ssh.forwardOut(
//       '127.0.0.1',
//       24000,
//       process.env.DEST_IP,
//       3306,
//       function(err, stream) {
//         if (err) return cb(err);
//         sqlConf.stream = stream;
//         state.db = mysql2.createPool(sqlConf)
//         // console.log(state.db);
//         console.log(state.ssh);
//         cb();
//       }
//     );
//   });
//
//   ssh.on('error', function(error) {
//     console.log('>> SSH >> ', new Date(), ' Connection ERROR', error);
//   });
//   ssh.on('end', function() {
//     console.log('>> SSH >> ', new Date(), ' Connection END');
//   });
//   ssh.on('close', function(isError) {
//     console.log('>> SSH >> ', new Date(), ' Connection CLOSED', isError);
//   });
//
//   ssh.connect(sshConf);
// }
//
//





exports.query = (queryString, cb) => {
  state.db.query(queryString, cb);
}




exports.asyncQuery = (queryString, values = []) => {
  return new Promise((resolve) => {
    // console.log('QUERY:', queryString, 'values: ', values)
    console.log('a query to db -- is closed:', state.db._closed);
    state.db.query(queryString, values, (error, result) => {
      if(error) {
        console.warn('ERROR')
        console.warn(error)
        resolve(new iError('DB_ERROR', error.sqlMessage,500));
      }
      else resolve(result);
    });
  })
}
