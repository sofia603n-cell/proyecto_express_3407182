//consolida o agrupa los enrutadores
const {Router} = require("express")
const enrutadorGeneral=Router()
const enrutadorP =require("./pruebaRouter")


enrutadorGeneral.use("/rutaprueba", enrutadorP)



module.exports= enrutadorGeneral


