 require('./config/config');

 const express = require('express');
 const app = express();
 const bodyParser = require('body-parser');

 app.use(bodyParser.urlencoded({ extended: false }));
 app.use(bodyParser.json());

 app.get('/', (request, response) => {

 });

 app.post('/usuario', (request, response) => {
     let body = request.body;

     if (body.name === undefined) {
         return response.status(400).json({
             ok: false,
             message: 'Nombre es necesario'
         });
     } else {
         return response.json({
             persona: body
         });
     }
 });

 app.listen(3000, (error) => {
     console.log(process.env.PORT);
 });