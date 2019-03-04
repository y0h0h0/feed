var db = require('./db');

module.exports.errorHandler = (res, message = 'Server error', code = 0, status = 400) => {
  res.status(status).json({
    error: {
      code,
      message
    }
  })
}

module.exports.getUser = (token) => {
  return new Promise( async(resolve) => {
      if(!token) resolve({error:{code:0, message:'token needed'}})
      let respSelect = await db.asyncQuery('SELECT * from `feed_users` WHERE `sid`= ? AND `confirmed` = 1 LIMIT 1', [token]);
      if(respSelect.error) resolve(respSelect);
      resolve(respSelect.result[0]);
  })
}
