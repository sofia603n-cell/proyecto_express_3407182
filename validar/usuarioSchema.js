// validaciones/usuarioSchema.js
const usuarioSchema = {
    name: {
        required: true,
        minLength: 3, // Equivale a tener más de 2 letras (3 o más)
        mensajeMin: "El 'name' debe tener más de 2 letras."
    },
    email: {
        required: true,
        regex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        mensajeRegex: "El formato del 'email' no es válido."
    }
};

module.exports = usuarioSchema;