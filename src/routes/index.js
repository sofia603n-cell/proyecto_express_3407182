//consolida o agrupa los enrutadores
const {Router} = require("express")
const enrutadorGeneral=Router()
const enrutadorP =require("./pruebaRouter")

const enrutadorAuth= require('./autententicarRouter')

enrutadorGeneral.use("/rutaprueba", enrutadorP)
enrutadorGeneral.use("/autenticar", enrutadorAuth)



module.exports= enrutadorGeneral


