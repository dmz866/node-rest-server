 require('./config/config');

 const express = require('express');
 const app = express();
 const mongoose = require('mongoose');

 const bodyParser = require('body-parser');

 app.use(bodyParser.urlencoded({ extended: false }));
 app.use(bodyParser.json());

 app.use(require('./routes/index'));

 mongoose.connect(process.env.URL_DB, (err, res) => {
     if (err) {
         throw err;
     }
     console.log('BDD ONLINE');
 });

 app.listen(3000, (error) => {
     console.log(process.env.PORT);
 });