const express = require('express');
const fileUpload = require('express-fileupload');
const fs = require('fs');
const path = require('path');
const app = express();
const Usuario = require('../models/usuario');
const Producto = require('../models/producto');

app.use(fileUpload({ useTempFiles: true }));

app.post('/upload/:tipo/:id', (request, response) => {
    let tipo = request.params.tipo;
    let id = request.params.id;

    if (!request.files) {
        return response.status(400).json({
            ok: false,
            error: {
                message: 'No files were uploaded.'
            }
        });
    }

    let archivo = request.files.archivo;
    let extValidas = ['png', 'jpg', 'gif', 'jpeg'];
    let nombreCortado = archivo.name.split('.');
    let ext = nombreCortado[nombreCortado - 1];
    let tipoValidos = ['usuarios', 'productos'];

    if (tipoValidos.indexOf(tipo) == -1) {
        return response.status(400).json({
            ok: false,
            error: {
                message: 'El tipo no es valido'
            }
        });
    }

    if (extValidas.indexOf(ext) == -1) {
        return response.status(400).json({
            ok: false,
            error: {
                message: 'Extension no valida'
            }
        });
    }

    let archivoName = `${id}-${new Date().getMilliseconds()}.${ext}`;

    archivo.mv(`uploads/${tipo}/${archivoName}`, (error) => {
        if (error) {
            return response.status(500).json({
                ok: false,
                error
            });
        }

        if (tipo === 'usuarios') {
            imagenUsuario(id, archivoName);
        } else {
            imagenProducto(id, archivoName);
        }
    });
});

function imagenUsuario(id, archivoNombre) {
    Usuario.findById(id, (error, usuarioDB) => {
        if (error) {
            return response.status(500).json({
                ok: false,
                error
            });
        }

        if (!usuarioDB) {
            return response.status(400).json({
                ok: false,
                error: {
                    message: 'Usuario no existe'
                }
            });
        }

        borrarArchivo(tipo, usuarioDB.img);

        usuarioDB.img = archivoNombre;
        usuarioDB.save((error, usuarioActualizado) => {
            if (error) {
                return response.status(500).json({
                    ok: false,
                    error
                });
            }

            return response.json({
                ok: true,
                usuario: usuarioActualizado
            });
        });
    });
}

function imagenProducto(id, archivoNombre) {
    Producto.findById(id, (error, productoDB) => {
        if (error) {
            return response.status(500).json({
                ok: false,
                error
            });
        }

        if (!productoDB) {
            return response.status(400).json({
                ok: false,
                error: {
                    message: 'Producto no existe'
                }
            });
        }

        borrarArchivo(tipo, productoDB.img);

        productoDB.img = archivoNombre;
        productoDB.save((error, productoActualizado) => {
            if (error) {
                return response.status(500).json({
                    ok: false,
                    error
                });
            }

            return response.json({
                ok: true,
                producto: productoActualizado
            });
        });
    });
}



function borrarArchivo(tipo, nombreArchivo) {
    let pathImagen = path.resolve(__dirname, `../../uploads/${tipo}/${ nombreArchivo }`);

    if (fs.existsSync(pathImagen)) {
        fs.unlinkSync(pathImagen);
    }
}

module.exports = app;