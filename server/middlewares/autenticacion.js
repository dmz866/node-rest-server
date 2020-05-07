const jwt = require('jsonwebtoken');

function verificarToken(request, response, next) {
    let token = request.get('token'); // FROM HEADER

    jwt.verify(token, process.env.SEED, (error, decoded) => {
        if (error) {
            return response.status(401).json({
                ok: false,
                error
            });
        }

        request.usuario = decoded.usuario;
        next();

    });
};

function verificarAdminRole(request, response, next) {
    let usuario = request.usuario;

    if (usuario.role !== 'ADMIN_ROLE') {
        return response.status(400).json({
            ok: false,
            error: {
                message: 'Usuario no es Admin'
            }
        });
    }

    next();
};

module.exports = {
    verificarToken,
    verificarAdminRole
};