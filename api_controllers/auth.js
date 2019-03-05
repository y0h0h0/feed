const express = require('express');
const router = express.Router();
const md5 = require('js-md5');
const sendmail = require('sendmail')();
var db = require('../db');
var { sendError , getUser , sendResult} = require('../functions');



router.post('/port', async (req,res)=>{
  res.send(process.env.PORT || 5000);
});

router.post('/register', async (req,res)=>{
  if(!req.body.name) return sendError(res, 'Bad nickname');
  if(!req.body.password) return sendError(res, 'Bad password');
  if(!req.body.email) return sendError(res, 'Bad email');
  let respSelect = await db.asyncQuery('SELECT * from `feed_users` WHERE `name`= ? OR `email` = ? ', [req.body.name, req.body.email]);
  if(respSelect.error) return sendError(res, 'Bad request');
  if(respSelect.result.length) return sendError(res, 'Name or email is already taken');
  let sid = md5(req.body.email + new Date);
  let respInsert = await db.asyncQuery(
    'INSERT INTO `feed_users` SET `name` = ? , `email` = ? , `password` = ? , `sid` = ? ,`userAgent` = ? ',
    [req.body.name, req.body.email, req.body.password, sid, req.headers['user-agent']]);
  if(respInsert.error) return sendError(res, 'Bad request');
  sendResult(res, true);
});


router.post('/requestConfirmEmail', async (req,res)=>{
  let email = req.body.email.toString().toLowerCase();
  if(!email) return sendError(res, 'Bad email');
  let respSelect = await db.asyncQuery('SELECT `sid` from `feed_users` WHERE `email`= ? AND `confirmed` = 0 LIMIT 1', [email]);
  if(respSelect.error) return sendError(res, 'Bad request');
  if(respSelect.result.length === 0) return sendError(res, 'Email is not used or is already confirmed');
  let { sid } = respSelect.result[0];
  sendmail({
    from: 'no-reply@feed.domain',
    to: email,
    silent: true,
    subject: 'Email confirmation',
    html: `Pls follow the link <a href="http://localhost:5000/api/auth/confirmEmail/${sid}">http://localhost:5000/api/auth/confirmEmail/${sid}</a>`,
  }, function(err, reply) {
    sendResult(res, true);
  });
});


router.get('/confirmEmail/:sid', async (req,res)=>{
  if(!req.params.sid) return sendError(res, 'Wrong code');
  let newsid = md5(req.params.sid + new Date);
  let respUpdate = await db.asyncQuery(
    'UPDATE `feed_users` SET `confirmed` = 1, `sid`= ? WHERE `sid` = ? AND `confirmed` = 0 LIMIT 1',
    [newsid , req.params.sid]);
  if(respUpdate.result.affectedRows === 1) {
    res.send('Okay, email has been confirmed'); // TODO: send a cool html page instead
  } else {
    res.send('Something went wrong'); // TODO: send another page
  }
});


router.post('/login', async (req,res)=>{
  if(!req.body.login) return sendError(res, 'Bad login');
  if(!req.body.password) return sendError(res, 'Bad password');
  let response = await db.asyncQuery(
    'SELECT `sid` FROM `feed_users` WHERE `confirmed` = 1 AND `email`= ? AND `password` = ? LIMIT 1',
    [req.body.login , req.body.password]);
  if(response.result.length === 0) return sendError(res, 'Wrong login and/or password');
  sendResult(res, response.result[0].sid);
});

router.get('/getMe', async (req,res)=>{
  let user = await getUser(req.query.token);
  if(user.error) return sendError(res, 'Wrong user', 'WRONG_TOKEN');
  sendResult(res, {
    id:user.id,
    name:user.name,
    email:user.email,
  });
});


module.exports = router;
