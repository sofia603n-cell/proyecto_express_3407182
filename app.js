const express = require('express') ;
require ('dotenv').config();  
const app = express();  
const port = process.env.MIPUERTO || 3003; 

app.get("/", (_, res) => { 
    res.send("API Rest Full con Express"); 
}); 
app.listen(port, () => { 
    console.log( `Servidor en funcionamiento en el puerto: ${port}`); 
}); 