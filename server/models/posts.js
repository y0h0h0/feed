const db = require('db');
const iError = require('helpers/iError');
const md5 = require('js-md5');
const sendmail = require('sendmail')();

const errors = {
  AUTH_01: new iError('AUTH_01', 'You should provide a name'),
}


module.exports.get = () => {
  return new Promise(async resolve => {
    let posts = await db.asyncQuery('SELECT * from `feed_posts` WHERE `archived` = 0 ORDER by `id` DESC LIMIT 20');
    return resolve(aUser);
  });
}





// module.exports.getPost = (id) => {
//   console.log('HRER')
//
//   return new Promise(async (resolve,reject) => {
//     // if(!id)
//
//
//     resolve(new Error('ddduufuufufufuf'));
//      // reject({error:'No post id'});
//
//
//
//
//     // let response = await db.asyncQuery('SELECT * from `feed_posts` WHERE `archived` = 0 AND `id` = ? ORDER by `id` DESC LIMIT 1', [id]);
//     // if(response.error) resolve({error:'Bad request'});
//     // if(response.result.length === 0) resolve({error:'No post found'});
//     // resolve({result:response.result[0]});
//     // resolve({result:true});
//   });
// }



// module.exports.getPost = (id) => {
//   console.log('HRER')
//
//   return new Promise(async (resolve) => {
//     if(!id) resolve({error:'No post id'});
//     let response = await db.asyncQuery('SELECT * from `feed_posts` WHERE `archived` = 0 AND `id` = ? ORDER by `id` DESC LIMIT 1', [id]);
//     if(response.error) resolve({error:'Bad request'});
//     if(response.result.length === 0) resolve({error:'No post found'});
//     resolve({result:response.result[0]});
//   });
// }
