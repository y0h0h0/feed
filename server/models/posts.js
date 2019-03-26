const db = require('db');
const iError = require('helpers/iError');
const md5 = require('js-md5');
const sendmail = require('sendmail')();
var { getUser } = require('../functions');

const errors = {
  POST_01: new iError('POST_01', 'Bad text'),
  POST_02: new iError('POST_02', 'Couldn\'t update the post. Probably wrong id'),
  POST_03: new iError('POST_03', 'Couldn\'t delete the post. Probably wrong id'),
}


module.exports.get = () => {
  return new Promise(async resolve => {
    let posts = await db.asyncQuery('SELECT `id`,`authorid`,`text`,`datetime` from `feed_posts` WHERE `archived` = 0 ORDER by `id` DESC LIMIT 20');
    if(posts.isError) return resolve(posts);

    let ids = [];
    posts.forEach(item => {
      if(ids.indexOf(item.authorid)<0) ids.push(item.authorid);
    });
    let resp = await db.asyncQuery('SELECT `id`,`name` from `feed_users` WHERE `id` IN ('+ ids.join(', ') +') ');
    let idsAsObj = {};
    resp.forEach(item => {idsAsObj[item.id] = item.name})
    posts.forEach(item => {item['authorname'] = idsAsObj[item.authorid]})
    return resolve(posts);
  });
}


module.exports.add = ({ token, text='' }) => {
  return new Promise(async resolve => {
      let user = await getUser(token);
      if(user.isError) return resolve(user);
      if(typeof text !== 'string' || !text.length) return resolve(errors.POST_01);
      let respInsert = await db.asyncQuery(
        'INSERT INTO `feed_posts` SET `authorid` = ? , `text` = ? , `datetime` = NOW()',
        [user.id, text]);
      if(respInsert.isError) return resolve(respInsert);
      let respSelect = await db.asyncQuery(
        'SELECT * FROM `feed_posts` WHERE `id`= ? AND `authorid`= ? LIMIT 1',
        [respInsert.insertId, user.id]);
      if(respSelect.isError) return resolve(respSelect);
      return resolve(respSelect[0])
  });
}


module.exports.update = ({ token, id, text='' }) => {
  return new Promise(async resolve => {
    let user = await getUser(token);
    if(user.isError) return resolve(user);
    if(typeof text !== 'string' || !text.length) return resolve(errors.POST_01);
    let respUpdate = await db.asyncQuery(
      'UPDATE `feed_posts` SET `text` = ? WHERE `authorid` = ? AND `id` = ? LIMIT 1',
      [text , user.id, id]);
      console.log(respUpdate)
    if(respUpdate.isError) return resolve(respUpdate);
    if(respUpdate.affectedRows === 0) return resolve(errors.POST_02)
    let respSelect = await db.asyncQuery(
      'SELECT * FROM `feed_posts` WHERE `id`= ? AND `authorid`= ? LIMIT 1',
      [id, user.id]);
    if(respSelect.isError) return resolve(respSelect);
    return resolve(respSelect[0])

  });
}


module.exports.delete = ({ token, id }) => {
  return new Promise(async resolve => {
    let user = await getUser(token);
    if(user.isError) return resolve(user);
    let respUpdate = await db.asyncQuery(
      'UPDATE `feed_posts` SET `archived` = 1 WHERE `authorid` = ? AND `id` = ? LIMIT 1',
      [user.id, id]);
    if(respUpdate.isError) return resolve(respUpdate);
    if(respUpdate.affectedRows === 0) return resolve(errors.POST_03)
    return resolve(true);
  });
}
