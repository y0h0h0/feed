const db = require('db');
const iError = require('helpers/iError');
const md5 = require('js-md5');
const sendmail = require('sendmail')();

const errors = {
  AUTH_01: new iError('AUTH_01', 'You should provide a name'),
  AUTH_02: new iError('AUTH_02', 'You should provide a password'),
  AUTH_03: new iError('AUTH_03', 'You should provide an e-mail'),
  AUTH_04: new iError('AUTH_04', 'Name or email is already taken'),

  CNFRM_01: new iError('CNFRM_01', 'Invalid email'),
  CNFRM_02: new iError('CNFRM_02', 'Email is not used or is already confirmed'),

  CNFRM_03: new iError('CNFRM_03', 'Email is not used or is already confirmed'),

  CNFRM_04: new iError('CNFRM_04', 'No login and/or password'),
  CNFRM_05: new iError('CNFRM_05', 'Wrong login and/or password'),
}


module.exports.register = ({name, password, email, userAgent = ''}) => {
  return new Promise(async resolve => {
    if(!name) return resolve(errors.AUTH_01);
    if(!password) return resolve(errors.AUTH_02);
    if(!email) return resolve(errors.AUTH_03);
    let aUser = await db.asyncQuery('SELECT `id` from `feed_users`  WHERE `name`= ? OR `email` = ? ', [name, email]);
    if(aUser.isError) return resolve(aUser);
    if(aUser.length) return resolve(errors.AUTH_04);
    let sid = md5(email + new Date);
    let respInsert = await db.asyncQuery(
      'INSERT INTO `feed_users` SET `name` = ? , `email` = ? , `password` = ? , `sid` = ? ,`userAgent` = ? ',
      [name, email, password, sid, userAgent]);
    if(respInsert.isError) return resolve(respInsert);
    return resolve(true);
  });
}




module.exports.requestConfirmEmail = ({email}) => {
  return new Promise(async resolve => {
    if(typeof email !== 'string') return resolve(errors.CNFRM_01);
    email = email.toString().toLowerCase();
    if(!email) return resolve(errors.CNFRM_01);
    let aUser = await db.asyncQuery('SELECT `sid` from `feed_users` WHERE `email`= ? AND `confirmed` = 0 LIMIT 1', [email]);
    if(aUser.isError) return resolve(aUser);
    if(aUser.length === 0) return resolve(errors.CNFRM_02);
    let { sid } = aUser[0];
    sendmail({
      from: 'no-reply@feed.domain',
      to: email,
      silent: true,
      subject: 'Email confirmation',
      html: `Pls follow the link <a href="http://localhost:5000/api/auth/confirmEmail/${sid}">http://localhost:5000/api/auth/confirmEmail/${sid}</a>`,
    }, function(err, reply) {
      return resolve(true);
    });

  });
}


module.exports.confirmEmail = ({sid}) => {
  return new Promise(async resolve => {
    if(!sid) return resolve(errors.CNFRM_03);
    let newsid = md5(sid + new Date);
    let respUpdate = await db.asyncQuery(
      'UPDATE `feed_users` SET `confirmed` = 1, `sid`= ? WHERE `sid` = ? AND `confirmed` = 0 LIMIT 1',
      [newsid , sid]);
    return resolve(respUpdate.affectedRows === 1)
  });
}


module.exports.login = ({ login, password }) => {
  return new Promise(async resolve => {
    if(!login || !password) return resolve(errors.CNFRM_04);
    let result = await db.asyncQuery(
      'SELECT `sid` FROM `feed_users` WHERE `confirmed` = 1 AND `email`= ? AND `password` = ? LIMIT 1',
      [login , password]);
    console.log(' --------- ')
    console.log(' ', result)
    console.log(' --------- ')
    if(result.length === 0) return resolve(errors.CNFRM_05);
    return resolve(result[0].sid)
  });
}
