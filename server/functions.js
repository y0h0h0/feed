var db = require('./db');
const iError = require('helpers/iError');

module.exports.sendError = (res, {message = 'Bad request', code = 0, status = 500}) => {
  return res.status(status).json({error:{code,message}})
}

module.exports.sendResult = (res, result = true, status = 200) => {
  return res.status(status).json({result})
}

module.exports.getUser = (token) => {
  return new Promise( async(resolve) => {
    if(!token) resolve(new iError('USR_01', 'Wrong token'))
    let respSelect = await db.asyncQuery('SELECT `id`,`name`,`password`,`email`,`userAgent`,`sid` from `feed_users` WHERE `sid`= ? AND `confirmed` = 1 LIMIT 1', [token]);
    if(respSelect.length === 0) resolve(new iError('USR_01', 'Wrong token'));
    resolve(respSelect[0]);
  })
}
