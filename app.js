const express = require('express') ;
require ('dotenv').config();  
const app = express();  
const port = process.env.MIPUERTO || 3003; 

const sistemaArchivo =require("fs");
const path = require("path");
const rutaArchivo = path.join(__dirname, "datos.json");

app.get("/", (_, res) => {
    res.send("API Rest Full con express");
});

app.get('/api/aprendices', (req, res) => {
    sistemaArchivo.readFile(rutaArchivo, 'utf-8', (error, data) => {
    if(error)res.status(500).json({error: 'Error al leer el archivo'});
    const listaAprendices = JSON.parse(data);
    res.status(200).json({aprendices: listaAprendices });
    });
});

app.post('/api/aprendices', (req, res) => {
     const datosAprendiz = req.body
    res.status(201).json({ mensaje: 'Aprendiz creado', datos: datosAprendiz});
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