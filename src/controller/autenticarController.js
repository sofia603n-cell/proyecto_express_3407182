const iniciarSesion = (req, res) =>{

  //simular una base de datos
  const uDB= {"usuario" : "deep", "clave": "1234"}

  try{
  const {usuario, clave}= req.body
  
    //comparar con uDB
    if (uDB.usuario !== usuario || uDB.clave !== clave){
      res.json({mensaje :"Credenciales incorrectos"})
    }

    res.json ({Mensaeje: "Bienvenido Uusario !!!!!"})

  }
  catch (error){
    res.json({Error: error})
  }
  
} 


const registrarse =async(res, req) => {
   try{
    const datos = req.body 

    res.json({datosRegistro: datos})
   }
    catch (error){
      res.json({errorrror :error})
    }
}






module.exports= {iniciarSesion, registrarse}
