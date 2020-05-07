const express = require('express');

let { verificarToken, verificarAdminRole } = require('../middlewares/autenticacion');
let app = express();
let Categoria = require('../models/categoria');

app.get('/categoria', verificarToken, (request, response) => {
    Categoria.find((error, categorias) => {
        if (error) {
            return response.status(400).json({
                ok: false,
                error
            });
        }

        return response.json({
            ok: true,
            categorias
        });
    });
});

app.get('/categoria/:id', verificarToken, (request, response) => {
    let id = request.params.id;
    Categoria.findById(id, (error, categoriaDB) => {
        if (error) {
            return response.status(400).json({
                ok: false,
                error
            });
        }

        return response.json({
            ok: true,
            categoria: categoriaDB
        });
    });
});

app.post('/categoria', verificarToken, (request, response) => {
    let body = request.body;
    body.usuario = req.usuario._id;

    Categoria.save(body, (error, categoriaDB) => {
        if (error) {
            return response.status(400).json({
                ok: false,
                error
            });
        }

        return response.json({
            ok: true,
            categoria: categoriaDB
        });
    });
});

app.put('/categoria', verificarToken, (request, response) => {
    let body = request.body;
    body.usuario = request.usuario._id;

    Categoria.findByIdAndUpdate(body, 'descripcion', (error, categoriaDB) => {
        if (error) {
            return response.status(400).json({
                ok: false,
                error
            });
        }

        return response.json({
            ok: true,
            categoria: categoriaDB
        });
    });
});

app.delete('/categoria/:id', [verificarToken, verificarAdminRole], (request, response) => {
    let id = request.params.id;
    Categoria.findByIdAndRemove(id, (error, categoriaDB) => {
        if (error) {
            return response.status(400).json({
                ok: false,
                error
            });
        }

        return response.json({
            ok: true,
            categoria: categoriaDB
        });
    });
});

module.exports = app;