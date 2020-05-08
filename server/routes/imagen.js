const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const { verificarToken } = require('../middlewares/autenticacion');

app.get('/imagen/:tipo/:img', verificarToken, (request, response) => {
    let tipo = request.params.tipo;
    let img = request.params.img;
    let pathImg = path.resolve(__dirname, `../../uploads/${tipo}/${img}`);

    if (fs.existsSync(pathImg)) {
        return response.sendFile(pathImg);
    }

    return response.sendFile(path.resolve(__dirname, '../assets/no-image.jpg'));
});

module.exports = app;