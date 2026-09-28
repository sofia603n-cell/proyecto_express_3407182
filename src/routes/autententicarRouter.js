const { Router } = require("express");
const enrutadorAuth = Router();

//importaciones del controlador
const {iniciarSesion, registrarse} = require("../controller/autenticarController");


enrutadorAuth.post("/registro", registrarse)

enrutadorAuth.post("/login", iniciarSesion)

module.exports=enrutadorAuth; 