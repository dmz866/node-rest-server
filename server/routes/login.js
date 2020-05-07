const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuario');
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);

app.post('/login', (request, response) => {
    let body = request.body;

    Usuario.findOne({ email: body.email }, (error, usuarioDB) => {
        if (error) {
            return response.status(500).json({
                ok: false,
                error
            });
        }

        if (!usuarioDB || !body.password || bcrypt.compareSync(body.password, usuarioDB.password)) {
            return response.status(400).json({
                ok: false,
                error: {
                    message: 'Usuario/Contrasena incorrecta *'
                }
            });
        }

        let token = jwt.sign({ usuario: usuarioDB }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });

        return response.json({
            ok: true,
            usuario: usuarioDB,
            token
        });
    });
});

async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID
    });
    const payload = ticket.getPayload();
    const userid = payload['sub'];

    return {
        nombre: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true
    };
}

app.post('/google', async(request, response) => {
    let token = request.body.idtoken;

    let googleUser = await verify(token).catch(error => {
        return response.status(403).json({
            ok: false,
            error
        });
    });

    Usuario.findOne({ email: googleUser.email }, (error, usuarioDB) => {
        if (error) {
            return response.status(500).json({
                ok: false,
                error
            });
        }

        if (usuarioDB) {
            if (!usuarioDB.google) {
                return response.status(400).json({
                    ok: false,
                    error: {
                        message: 'Debe usar su auth normal'
                    }
                });
            } else {
                let token = jwt.sign({ usuario: usuarioDB }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });

                return response.json({
                    ok: true,
                    usuario: usuarioDB,
                    token
                });
            }
        } else {
            let newUsuario = new Usuario();
            newUsuario.nombre = googleUser.nombre;
            newUsuario.email = googleUser.email;
            newUsuario.img = googleUser.img;
            newUsuario.google = true;
            newUsuario.password = ':)';

            Usuario.save(newUsuario, (error, usuarioDB) => {
                if (error) {
                    return response.status(400).json({
                        ok: false,
                        error
                    });
                }

                let token = jwt.sign({ usuario: usuarioDB }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });

                return response.json({
                    ok: true,
                    usuario: usuarioDB,
                    token
                });
            });
        }
    });
});

module.exports = app;