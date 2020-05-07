const express = require('express');
const _ = require('underscore');

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
        }).populate('usuario', 'nombre email')
        .sort('descripcion');
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
    }).populate('usuario', 'nombre email');
});

app.post('/categoria', verificarToken, (request, response) => {
    let body = request.body;
    body.usuario = request.usuario._id;

    Categoria.create(body, (error, categoriaDB) => {
        if (error) {
            return response.status(500).json({
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

app.put('/categoria/:id', verificarToken, (request, response) => {
    let id = request.params.id;
    let body = request.body;
    body = _.pick(body, ['descripcion']);

    Categoria.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (error, categoriaDB) => {
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