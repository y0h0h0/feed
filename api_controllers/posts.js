const express = require('express');
const router = express.Router();
const md5 = require('js-md5');
const sendmail = require('sendmail')();
var db = require('../db');
var { errorHandler , getUser } = require('../functions');



router.post('/get', async (req,res)=>{
  let response = await db.asyncQuery('SELECT * from `feed_posts` WHERE `archived` = 0 ORDER by `id` DESC LIMIT 20');
  if(response.error) return errorHandler(res, 'Bad request');
  res.status(200).json({result:response.result});
});



router.post('/add', async (req,res)=>{

  let user = await getUser(req.body.token);
  if(user.error) return errorHandler(res, 'Wrong user');

  if(!req.body.text) return errorHandler(res, 'Bad text');

  let respInsert = await db.asyncQuery(
    'INSERT INTO `feed_posts` SET `authorid` = ? , `text` = ? , `datetime` = NOW()',
    [user.id, req.body.text]);
  if(respInsert.error) return errorHandler(res, 'Bad request: insert');

  let respSelect = await db.asyncQuery(
    'SELECT * FROM `feed_posts` WHERE `id`= ? AND `authorid`= ? LIMIT 1',
    [respInsert.result.insertId, user.id]);

  if(respSelect.error) return errorHandler(res, 'Bad request: select');
  let message = respSelect.result[0];
  res.status(200).json({result:message});

});






router.post('/update', async (req,res)=>{

  let user = await getUser(req.body.token);
  if(user.error) return errorHandler(res, 'Wrong user');
  if(!req.body.text) return errorHandler(res, 'Bad text');
  if(!req.body.id) return errorHandler(res, 'Bad id');

  let respUpdate = await db.asyncQuery(
    'UPDATE `feed_posts` SET `text` = ? WHERE `authorid` = ? AND `id` = ? LIMIT 1',
    [req.body.text , user.id, req.body.id]);
  if(respUpdate.error) return errorHandler(res, 'Bad request: update');

  if(respUpdate.result.affectedRows === 0) return errorHandler(res, 'Something went wrong');

  let respSelect = await db.asyncQuery(
    'SELECT * FROM `feed_posts` WHERE `id`= ? AND `authorid`= ? LIMIT 1',
    [req.body.id, user.id]);

  if(respSelect.error) return errorHandler(res, 'Bad request: select');
  let message = respSelect.result[0];
  res.status(200).json({result:message});

});





router.post('/delete', async (req,res)=>{

  let user = await getUser(req.body.token);
  if(user.error) return errorHandler(res, 'Wrong user');
  if(!req.body.id) return errorHandler(res, 'Bad id');

  let respUpdate = await db.asyncQuery(
    'UPDATE `feed_posts` SET `archived` = 1 WHERE `authorid` = ? AND `id` = ? LIMIT 1',
    [user.id, req.body.id]);

  if(respUpdate.error) return errorHandler(res, 'Bad request: update');

  if(respUpdate.result.affectedRows === 0) return errorHandler(res, 'Something went wrong');
  res.status(200).json({result:true});

});


module.exports = router;
