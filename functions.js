var db = require('./db');

module.exports.sendError = (res, message = 'Bad request', code = 0, status = 400) => {
  res.status(status).json({
    error: {
      code,
      message
    }
  })
}

module.exports.sendResult = (res, result = true, status = 200) => {
  res.status(status).json({result})
}

module.exports.getUser = (token) => {
  return new Promise( async(resolve) => {
      if(!token) resolve({error:{code:0, message:'token needed'}})
      let respSelect = await db.asyncQuery('SELECT * from `feed_users` WHERE `sid`= ? AND `confirmed` = 1 LIMIT 1', [token]);
      if(respSelect.result.length === 0) resolve({error:'no user'});
      resolve(respSelect.result[0]);
  })
}
