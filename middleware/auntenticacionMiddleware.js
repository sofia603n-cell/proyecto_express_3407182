const jwtoken = require('jsonwebtoken');
const autenticacion = (req, res, next) => {
    const token = req.header('campoAutenticar')?.split(' ')[1]; // Obtener el token del encabezado Authorization
    if (!token) {
        return res.status(401).json({ mensaje: 'Acceso no autorizado. Token no proporcionado.' });
    }
    // verificar el token
    jwtoken.verify(token, process.env.JWT_SECRETO, (error, usuario)=>{
        if(error){
            return res.status(403).json({ mensaje: 'Token inválido o expirado.' });
        }
        req.usuario = usuario
        next()
    })
}

module.exports = autenticacion;