const express = require('express');
require('dotenv').config();
const PORT = process.env.PORT || 5000;
const chalk = require('chalk');
var bodyParser = require('body-parser');
var db = require('./db');
const app = express();
var cookieParser = require('cookie-parser');
app.use(cookieParser());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));



app.use((req, res, next) => { // CORS
  res.append('Access-Control-Allow-Origin', ['*']);
  res.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.append('Access-Control-Allow-Headers', 'Content-Type');
  next();
});



app.use('/', express.static('front/build'));

app.use('/api/auth/', require('./api_controllers/auth.js'));
app.use('/api/posts/', require('./api_controllers/posts.js'));

app.use('/api/*', (req, res) => {
  console.log(req)
  res.status(404).send('Wrong api endpoint');
});



// Front-end SPA
app.use('*', (req, res) => {
  res.sendFile(__dirname + '/front/build/index.html');
});



db.connect((err)=>{
  if(err) return err;

  app.listen(PORT, () => {
    console.clear();
    console.log(chalk.bgMagenta.black(`Listening on ${ PORT }` ) + chalk.bgBlue.black(`==============` )    );
  })

})
