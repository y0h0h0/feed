const express = require('express');
const router = express.Router();
const md5 = require('js-md5');
const sendmail = require('sendmail')();
var db = require('db');
var { sendError , getUser , sendResult} = require('../functions');

const models = require('models/posts');

var multer  = require('multer')
var upload = multer({ dest: 'attachments/' })


router.get('/get', async (req,res)=>{
  const result = await models.get();
  if(result.isError) return sendError(res, result);
  sendResult(res, result);
});


router.post('/add', async (req,res)=>{
  const result = await models.add({
      text: req.body.text,
      token: req.body.token
    });
  if(result.isError) return sendError(res, result);
  sendResult(res, result);
});


router.post('/update', async (req,res)=>{
  const result = await models.update({
      text: req.body.text,
      id: req.body.id,
      token: req.body.token
    });
  if(result.isError) return sendError(res, result);
  sendResult(res, result);
});


router.post('/delete', async (req,res)=>{
  const result = await models.delete({
      id: req.body.id,
      token: req.body.token
    });
  if(result.isError) return sendError(res, result);
  sendResult(res, result);
});


module.exports = router;
