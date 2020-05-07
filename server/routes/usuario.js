const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const _ = require('underscore');
const Usuario = require('../models/usuario');
const { verificarToken, verificarAdminRole } = require('../middlewares/autenticacion');

app.get('/usuario', verificarToken, (request, response) => {
    let desde = Number(request.query.desde || 0);
    let limite = Number(request.query.limite || 5);
    let condiciones = { estado: true };

    //Usuario.find(condiciones, 'nombre email', (error, usuarios) => {
    Usuario.find(condiciones, (error, usuarios) => {
            if (error) {
                return response.status(400).json({
                    ok: false,
                    error
                });
            }

            Usuario.count(condiciones, (error, result) => {
                return response.json({
                    ok: true,
                    usuarios,
                    total: result
                });
            });
        })
        .skip(desde)
        .limit(limite);
});

app.post('/usuario', [verificarToken, verificarAdminRole], (request, response) => {
    let body = request.body;
    let usuario = new Usuario({
        nombre: body.nombre,
        password: bcrypt.hashSync(body.password, 10),
        email: body.email,
        role: body.role
    });

    usuario.save((error, usuarioDB) => {
        if (error) {
            return response.status(400).json({
                ok: false,
                error
            });
        }

        return response.json({
            ok: true,
            usuario: usuarioDB
        });
    });
});

app.put('/usuario/:id', [verificarToken, verificarAdminRole], (request, response) => {
    let id = request.params.id;
    let body = _.pick(request.body, ['nombre', 'email', 'img', 'role', 'estado']);

    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (error, usuarioDB) => {
        if (error) {
            return response.status(400).json({
                ok: false,
                error
            });
        }

        return response.json({
            ok: true,
            usuario: usuarioDB
        });
    });
});

app.delete('/usuario/:id', [verificarToken, verificarAdminRole], (request, response) => {
    let id = request.params.id;

    //Usuario.findByIdAndRemove(id, (error, usuarioEliminado) => {
    Usuario.findByIdAndUpdate(id, { estado: false }, (error, usuarioDB) => {
        if (error) {
            return response.status(400).json({
                ok: false,
                error
            });
        }

        if (!usuarioDB) {
            return response.status(400).json({
                ok: false,
                error: {
                    message: 'Usuario no encontrado'
                }
            });
        }

        return response.json({
            ok: true,
            usuario: usuarioDB
        });
    });
});

module.exports = app;