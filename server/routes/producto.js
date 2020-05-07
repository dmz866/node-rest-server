const express = require('express');
const _ = require('underscore');

let { verificarToken, verificarAdminRole } = require('../middlewares/autenticacion');
let app = express();
let Producto = require('../models/producto');

app.get('/productos/buscar/:termino', (request, response) => {
    let termino = request.params.termino;
    let regex = new RegExp(termino, 'i');

    Producto.find({ nombre: regex }, (error, productos) => {
            if (error) {
                return response.status(500).json({
                    ok: false,
                    error
                });
            }

            return response.json({
                ok: true,
                productos
            });
        })
        .populate('categoria', 'descripcion')
        .populate('usuario', 'nombre email');
});

app.get('/productos', (request, response) => {
    Producto.find({ disponible: true }, (error, productos) => {
            if (error) {
                return response.status(500).json({
                    ok: false,
                    error
                });
            }

            return response.json({
                ok: true,
                productos
            });
        }).populate('categoria', 'descripcion')
        .populate('usuario', 'nombre email');
});

app.get('/producto/:id', (request, response) => {
    let id = request.params.id;
    let desde = request.query.desde || 0;
    let hasta = request.query.hasta || 3;

    Producto.findById(id, (error, productoDB) => {
            if (error) {
                return response.status(500).json({
                    ok: false,
                    error
                });
            }

            return response.json({
                ok: true,
                producto: productoDB
            });
        }).populate('categoria', 'descripcion')
        .populate('usuario', 'nombre email')
        .skip(desde)
        .limit(hasta);
});

app.post('/producto/', verificarToken, (request, response) => {
    let body = request.body;
    body.usuario = request.usuario._id;

    Producto.create(body, (error, productoDB) => {
        if (error) {
            return response.status(500).json({
                ok: false,
                error
            });
        }

        return response.json({
            ok: true,
            producto: productoDB
        });
    });
});

app.put('/producto/:id', (request, response) => {
    let id = request.params.id;
    let body = _.pick(request.body, ['nombre', 'precioUni', 'disponible']);

    Producto.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (error, productoDB) => {
        if (error) {
            return response.status(500).json({
                ok: false,
                error
            });
        }

        return response.json({
            ok: true,
            producto: productoDB
        });
    });
});

app.delete('/producto/:id', (request, response) => {
    let id = request.params.id;

    Producto.findByIdAndUpdate(id, { disponible: false }, { new: true, runValidators: true }, (error, productoDB) => {
        if (error) {
            return response.status(500).json({
                ok: false,
                error
            });
        }

        return response.json({
            ok: true,
            producto: productoDB
        });
    });
});

module.exports = app;