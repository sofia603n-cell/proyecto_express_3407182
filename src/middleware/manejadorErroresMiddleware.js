const manejadorErroresMiddleware = (error, req, res, next) => {
    const codigoError = error.statusCode || 500;
    const mensajeError = error.message || 'Error interno del servidor';
    console.error(`[Error]: ${new Date().toISOString()} - ${codigoError} - ${mensajeError} - ${req.method} ${req.url} - ${req.ip}`);
    if (error.stack){
        console.log(error.stack)
    }
    res.json({ERROR: "", codigoError, mensajeError,
// configurar .env, para mostrar errores solo en modo development
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
    })
    next()
}

module.exports = manejadorErroresMiddleware;