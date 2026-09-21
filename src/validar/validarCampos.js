// validaciones/validarCampos.js
const validarCampos = (schema) => {
    return (req, res, next) => {
        const body = req.body;

        // Recorremos las reglas definidas en el esquema
        for (let campo in schema) {
            const regla = schema[campo];
            const valor = body[campo];

            // 1. Validar campos requeridos
            if (regla.required && (!valor || valor.trim() === "")) {
                return res.status(400).json({ 
                    error: `El campo '${campo}' es obligatorio.` 
                });
            }

            // Si el campo viene y tiene contenido, procedemos con sus reglas específicas:

            // 2. Validar longitud mínima (para el name > 2 letras)
            if (regla.minLength && valor.trim().length < regla.minLength) {
                return res.status(400).json({ 
                    error: regla.mensajeMin 
                });
            }

            // 3. Validar expresión regular (para el email)
            if (regla.regex && !regla.regex.test(valor)) {
                return res.status(400).json({ 
                    error: regla.mensajeRegex 
                });
            }
        }

        // Si todas las validaciones pasan, continúa con el controlador
        next();
    };
};

module.exports = validarCampos;