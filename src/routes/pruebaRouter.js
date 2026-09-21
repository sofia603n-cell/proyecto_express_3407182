const {Router} = require("express")

const enrutadorP = Router()

enrutadorP.get("/rutaPersonal", (req, res) => {
    res.json({mensaje:"Ruta de prueba, personal"})
})

//se realiza todas las rutas con (POST, PUT, DELETE) para que se pueda probar el funcionamiento de la API

module.exports = enrutadorP