const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    //Leer el token desde el header
    const token = req.header('x-auth-token');

    //Revisar si no hay token
    if(!token) {
        return res.status(401).json({msg: 'No hay token, permiso Denegado'});
    }

    //Validar el token
    try {
        const cifrado = jwt.verify(token, process.env.SECRETA);
        req.usuario = cifrado.usuario;
        next(); //Avanza al siguiente middleware
    } catch (error) {
        res.status(401).json({msg: 'Token no válido'})
    }
}