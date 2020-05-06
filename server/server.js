 require('./config/config');

 const express = require('express');
 const app = express();
 const mongoose = require('mongoose');

 const bodyParser = require('body-parser');

 app.use(bodyParser.urlencoded({ extended: false }));
 app.use(bodyParser.json());

 app.use(require('./routes/usuario'));

 mongoose.connect('mongodb://localhost:27017/cafe', (err, res) => {
     if (err) {
         throw err;
     }
     console.log('BDD ONLINE');
 });

 app.listen(3000, (error) => {
     console.log(process.env.PORT);
 });