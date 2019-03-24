const express = require('express');
const router = express.Router();
const db = require('db');
const { sendError , getUser , sendResult } = require('functions');
const { register , requestConfirmEmail, confirmEmail, login } = require('models/auth');


router.post('/register', async (req,res)=>{
  const result = await register({
                  name: req.body.name,
                  password: req.body.password,
                  email: req.body.email,
                  userAgent: req.headers['user-agent']
                });
  if(result.isError) return sendError(res, result);
  sendResult(res, result);
});


router.post('/requestConfirmEmail', async (req,res)=>{
  const result = await requestConfirmEmail({email: req.body.email});
  if(result.isError) return sendError(res, result);
  sendResult(res, result);
});


router.get('/confirmEmail/:sid', async (req,res)=>{
  const result = await confirmEmail({sid: req.params.sid});
  if(result.isError) return sendError(res, result);
  res.redirect('/emailConfirm?=' + (result===true ? 'done' : 'wrong'));
});


router.post('/login', async (req,res)=>{
  const result = await login({
    login: req.body.login,
    password: req.body.password,
  });
  if(result.isError) return sendError(res, result);
  sendResult(res, result);
});


router.get('/getMe', async (req,res)=>{
  let user = await getUser(req.query.token);
  if(user.isError) return sendError(res, user);
  sendResult(res, {
    id:user.id,
    name:user.name,
    email:user.email,
  });
});



module.exports = router;
