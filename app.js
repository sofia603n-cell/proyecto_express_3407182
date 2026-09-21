const express = require('express');
require('dotenv').config();
const sistemaArchivo = require("fs")
// fs : fileSystem 
const ruta = require("path")
// permite usar rutas
const rutaMiArchivo = ruta.join(__dirname, "datos.json")

// importar validaciones
const usuarioSchema = require("./validaciones/usuarioSchema")
const validarCampos = require("./validaciones/validarCampos")

const app = express();
const PORT = process.env.PORT || 3003;
const registroMiddleware = require("./middleware/registroMiddleware")
const manejadorErroresMiddleware = require("./middleware/manejadorErroresMiddleware")
// middleware para parsear el body de las peticiones
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// usar nuestros middlewares
app.use(registroMiddleware);

// importar multer para manejar archivos
const multer = require("multer")
// almacenamiento 
const almacen = multer.diskStorage({
    // cb es call back, es una funcion que se ejecuta cuando se termina de procesar el archivo
    // callback llama una funcion dentro de otra funcion
    destination: (req, file, cb) => {
        cb(null, "misImagenes/")
    },
    filename: (req, file, cb) => {
        const extension = ruta.extname(file.originalname)
        cb(null, `${Date.now()}${extension}`)
    }
})
// multer recibe el archivo y guardar en la carpeta misImagenes con un nombre unico
const subir = multer({ storage: almacen })

app.get('/', (req, res) => {
    res.json({ mensaje: '¡API Rest Full con express!' });
});

app.get('/api/aprendices', (req, res) => {
    // res.status(200).json({ mensaje: 'Lista de aprendices' });
    sistemaArchivo.readFile(rutaMiArchivo, "utf-8", (error, datos) => {
        if (error) res.status(500).json({ mensaje: 'Error al leer el archivo' });
        const listaAprendices = JSON.parse(datos)
        res.status(200).json({ listado: listaAprendices });
    }
);
});

app.post('/api/aprendices', subir.single("imagen"), validarCampos(usuarioSchema), (req, res) => {
    const datosAprendiz = req.body
    
    // Si envían un id lo respeta; de lo contrario, se autogenera con la fecha actual
    datosAprendiz.id = datosAprendiz.id || Date.now().toString();
    
    datosAprendiz.imagen = req.file ? `/misImagenes/${req.file.filename}` : "sin imagen"
    
    // se lee el archivo y se verifica la unicidad del ID
    sistemaArchivo.readFile(rutaMiArchivo, "utf-8", (error, datos) => {
        if (error) return res.status(500).json({ mensaje: 'Error al leer el archivo' });
        const listaAprendices = JSON.parse(datos);
        
        // AQUÍ ASEGURAS QUE EL ID SEA ÚNICO:
        const idExistente = listaAprendices.some(aprendiz => aprendiz.id === datosAprendiz.id);
        if (idExistente) {
            return res.status(400).json({ mensaje: `El ID '${datosAprendiz.id}' ya está registrado. Debe ser único.` });
        }
        
        listaAprendices.push(datosAprendiz);
        
        // se escribe el aprendiz en el archivo
        sistemaArchivo.writeFile(rutaMiArchivo, JSON.stringify(listaAprendices, null, 2), (error) => {
            if (error) return res.status(500).json({ mensaje: 'Error al crear el aprendiz en el archivo' });
            res.status(201).json({ mensaje: 'Aprendiz creado', datos: datosAprendiz });
        });
    });
});

app.patch('/api/aprendices/:id_aprendiz', subir.single("imagen"), (req, res) => {
    const idAprendiz = req.params.id_aprendiz;
    const datosActualizados = req.body;
    
    sistemaArchivo.readFile(rutaMiArchivo, "utf-8", (error, datos) => {
        if (error) return res.status(500).json({ mensaje: 'Error al leer el archivo' });
        const listaAprendices = JSON.parse(datos);
        
        // Buscar el índice del aprendiz por su id
        const index = listaAprendices.findIndex(aprendiz => aprendiz.id === idAprendiz);
        if (index === -1) {
            return res.status(404).json({ mensaje: 'Aprendiz no encontrado' });
        }
        
        // Si se subió una nueva imagen, actualizar la ruta; de lo contrario, mantener la anterior
        if (req.file) {
            datosActualizados.imagen = `/misImagenes/${req.file.filename}`;
        }
        
        // Fusionar los datos existentes con los nuevos campos enviados
        listaAprendices[index] = {
            ...listaAprendices[index],
            ...datosActualizados
        };
        
        // Guardar la lista actualizada en el archivo JSON
        sistemaArchivo.writeFile(rutaMiArchivo, JSON.stringify(listaAprendices, null, 2), (error) => {
            if (error) return res.status(500).json({ mensaje: 'Error al actualizar el aprendiz en el archivo' });
            res.status(200).json({ mensaje: 'Aprendiz actualizado', datos: listaAprendices[index] });
        });
    });
});

app.delete('/api/aprendices/:id_aprendiz', (req, res) => {
    const idAprendiz = req.params.id_aprendiz;
    
    sistemaArchivo.readFile(rutaMiArchivo, "utf-8", (error, datos) => {
        if (error) return res.status(500).json({ mensaje: 'Error al leer el archivo' });
        const listaAprendices = JSON.parse(datos);
        
        // Buscar el índice del aprendiz por su id
        const index = listaAprendices.findIndex(aprendiz => aprendiz.id === idAprendiz);
        if (index === -1) {
            return res.status(404).json({ mensaje: 'Aprendiz no encontrado' });
        }
        
        // Eliminar el aprendiz de la lista
        listaAprendices.splice(index, 1);
        
        // Guardar la lista actualizada en el archivo JSON
        sistemaArchivo.writeFile(rutaMiArchivo, JSON.stringify(listaAprendices, null, 2), (error) => {
            if (error) return res.status(500).json({ mensaje: 'Error al eliminar el aprendiz en el archivo' });
            res.status(200).json({ mensaje: 'Aprendiz eliminado', datos: listaAprendices[index] });
        });
    });
});

app.post('/api/aprendices/login', (req, res) => {
    const datosAprendiz = req.body;
    const edad = req.body.edad;
    if (!datosAprendiz.edad) {
        res.status(400).json({ mensaje: 'No se recibieron datos del aprendiz' });
    }
    else if (edad >= 18) {
        res.status(201).json({ mensaje: 'Bienvenido', datos: datosAprendiz.nombre, edad: edad });
    }
    else {
        res.status(401).json({ mensaje: 'No puedes ingresar, eres menor de edad', edad: edad });
    }
});

// provocando error 
app.get('/api/error', (req, res, next) => {
    next(new Error('Error provocado'));
})

app.use(manejadorErroresMiddleware);

app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto http://localhost:${PORT}`);
});