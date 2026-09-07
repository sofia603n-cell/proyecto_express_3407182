const express = require('express') ;
require ('dotenv').config();  
const app = express();  
const port = process.env.MIPUERTO || 3003; 

const sistemaArchivo =require("fs");
const path = require("path");
const rutaArchivo = path.join(__dirname, "datos.json");
//importar multer
const multer = require("multer");
//almacenamiento de archivos
const storage = multer.diskStorage({
    destination: (req, file, cb)=> {
        cb(null, "imagenes/");
    },
    filename: (req, file, cb) => {
        const extension = path.extname(file.originalname);
        cb(null, `${Date.now()}${extension}`);
    }
})

const upload = multer({storage: storage});



app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.get("/", (_, res) => {
    res.send("API Rest Full con express");
});

app.get('/api/aprendices', (req, res) => {
    sistemaArchivo.readFile(rutaArchivo, "utf-8", (error, datos) => {
    if(error)res.status(500).json({error: 'Error al leer el archivo'});
    const listaAprendices = JSON.parse(datos);
    res.status(200).json({aprendices: listaAprendices });
    });

   
    });


app.post('/api/aprendices', upload.single('imagen'), (req, res) => {

    const datosAprendiz = req.body

    datosAprendiz.imagen = req.file? `/imagenes/${req.file.filename}` : "sin imagen";


    sistemaArchivo.readFile(rutaArchivo, "utf-8", (error, datos) => {
        if (error) res.status(500).json({error: 'Error al leer el archivo'})
    

    const listaAprendices = JSON.parse(datos)
        
    listaAprendices.push(datosAprendiz)

    sistemaArchivo.writeFile(rutaArchivo, JSON.stringify(listaAprendices, null, 2), (error) => {
        if (error) res.status(500).json({error: 'Error al escribir el archivo'})
        res.status(201).json({mensaje: 'Aprendiz agregado correctamente', datos: datosAprendiz})
        })
    })


});





app.patch('/api/aprendices/:id_aprendiz', (req, res) => {
    res.status(200).json({ mensaje: 'Aprendiz actualizado'});
});

app.delete('/api/aprendices/:id_aprendiz', (req, res) => {
    res.status(200).json({ mensaje: 'Eliminar aprendiz' });
});

app.post('/api/aprendices/login', (req, res) => {
    const datosAprendiz = req.body;
    const edad = req.body.edad;
    if (!datosAprendiz.edad){
        res.status(400).json({mensaje:'No se recibieron datos del aprendiz'});
    }
    else if (edad >= 18) {
    res.status(201).json({ mensaje: 'Bienvenido', datos: datosAprendiz.nombre, edad: edad });}
    else {
        res.status(401).json({mensaje:'No puedes ingresar, eres menor de edad', edad: edad});
    }
});

app.listen(port, () => { 
    console.log( `Servidor en funcionamiento en el puerto: ${port}`); 
}); 