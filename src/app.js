require("dotenv")
const express =  require('express')


const app = express()

//importar los middleware
app.use(express.json())
app.use(express.urlencoded({extended: true}))


//debemos importar los routers
const enrutadorGeneral = require("./routes")
app.use("/api", enrutadorGeneral)


//endpoind de la ruta raiz, de bienvenida a la api 

app.get('/', (req, res) => {
    res.send("api rest 3407182 en funcionamiento")
})



const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});

module.exports = app