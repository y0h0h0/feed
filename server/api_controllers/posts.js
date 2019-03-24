const express = require('express');
const router = express.Router();
const md5 = require('js-md5');
const sendmail = require('sendmail')();
var db = require('db');
var { sendError , getUser , sendResult} = require('../functions');


// const { getPost } = require('../models/posts');
const postModels = require('models/posts');

var multer  = require('multer')
var upload = multer({ dest: 'attachments/' })


router.get('/get', async (req,res)=>{
  let response = await db.asyncQuery('SELECT * from `feed_posts` WHERE `archived` = 0 ORDER by `id` DESC LIMIT 20');
  if(response.error) return sendError(res, 'Bad request');
  sendResult(res, response.result);
});




router.get('/getPost/:id', async (req,res)=>{

  // let response = await postModels.getPost(req.params.id).catch((err) => {
  //   console.log('EEEOOOEEEEE', err);
  //   return sendError(res, err);
  // });

  let response = await postModels.getPost(req.params.id).catch((err) => {
    console.log('EEEOOOEEEEE', err);
    return sendError(res, err);
  });


  console.log("CONTINUE", response);





  if(response.error) return sendError(res, response.error);
  else return sendResult(res, response.result);
});


// router.get('/getPost/:id', async (req,res)=>{
//   let response = await postModels.getPost(req.params.id);
//   if(response.error) return sendError(res, response.error);
//   else return sendResult(res, response.result);
// });





router.post('/add', async (req,res)=>{

  let user = await getUser(req.body.token);
  if(user.error) return sendError(res, 'Wrong user');

  if(!req.body.text) return sendError(res, 'Bad text');

  let respInsert = await db.asyncQuery(
    'INSERT INTO `feed_posts` SET `authorid` = ? , `text` = ? , `datetime` = NOW()',
    [user.id, req.body.text]);
  if(respInsert.error) return sendError(res, 'Bad request: insert');

  let respSelect = await db.asyncQuery(
    'SELECT * FROM `feed_posts` WHERE `id`= ? AND `authorid`= ? LIMIT 1',
    [respInsert.result.insertId, user.id]);

  if(respSelect.error) return sendError(res, 'Bad request: select');
  let message = respSelect.result[0];
  sendResult(res, message);
});






router.post('/update', async (req,res)=>{

  let user = await getUser(req.body.token);
  if(user.error) return sendError(res, 'Wrong user');
  if(!req.body.text) return sendError(res, 'Bad text');
  if(!req.body.id) return sendError(res, 'Bad id');

  let respUpdate = await db.asyncQuery(
    'UPDATE `feed_posts` SET `text` = ? WHERE `authorid` = ? AND `id` = ? LIMIT 1',
    [req.body.text , user.id, req.body.id]);
  if(respUpdate.error) return sendError(res, 'Bad request: update');

  if(respUpdate.result.affectedRows === 0) return sendError(res, 'Something went wrong');

  let respSelect = await db.asyncQuery(
    'SELECT * FROM `feed_posts` WHERE `id`= ? AND `authorid`= ? LIMIT 1',
    [req.body.id, user.id]);

  if(respSelect.error) return sendError(res, 'Bad request: select');
  let message = respSelect.result[0];
  sendResult(res, message);

});





router.post('/delete', async (req,res)=>{

  let user = await getUser(req.body.token);
  if(user.error) return sendError(res, 'Wrong user');
  if(!req.body.id) return sendError(res, 'Bad id');

  let respUpdate = await db.asyncQuery(
    'UPDATE `feed_posts` SET `archived` = 1 WHERE `authorid` = ? AND `id` = ? LIMIT 1',
    [user.id, req.body.id]);

  if(respUpdate.error) return sendError(res, 'Bad request: update');

  if(respUpdate.result.affectedRows === 0) return sendError(res, 'Something went wrong');
  sendResult(res, true);
});


module.exports = router;
