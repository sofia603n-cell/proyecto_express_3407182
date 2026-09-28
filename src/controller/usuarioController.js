// Simulación de base de datos en memoria (puedes reemplazarlo luego con datos.json o DB)
let usuarios = [
  { id: 1, nombre: 'Ana' },
  { id: 2, nombre: 'Carlos' }
];

// 1. Obtener todos los usuarios (GET)
const obtenerUsuarios = (req, res) => {
  res.json(usuarios);
};

// 2. Obtener un usuario por ID (GET)
const obtenerUsuarioPorId = (req, res) => {
  const id = parseInt(req.params.id);
  const usuario = usuarios.find(u => u.id === id);

  if (!usuario) {
    return res.status(404).json({ mensaje: 'Usuario no encontrado' });
  }

  res.json(usuario);
};

// 3. Crear un nuevo usuario (POST)
const crearUsuario = (req, res) => {
  const { nombre } = req.body;

  if (!nombre) {
    return res.status(400).json({ mensaje: 'El nombre es requerido' });
  }

  const nuevoUsuario = {
    id: usuarios.length + 1,
    nombre
  };

  usuarios.push(nuevoUsuario);
  res.status(201).json(nuevoUsuario);
};

// 4. Actualizar usuario (PUT)
const actualizarUsuario = (req, res) => {
  const id = parseInt(req.params.id);
  const { nombre } = req.body;

  const usuario = usuarios.find(u => u.id === id);

  if (!usuario) {
    return res.status(404).json({ mensaje: 'Usuario no encontrado' });
  }

  usuario.nombre = nombre || usuario.nombre;
  res.json({ mensaje: 'Usuario actualizado', usuario });
};

// 5. Eliminar usuario (DELETE)
const eliminarUsuario = (req, res) => {
  const id = parseInt(req.params.id);
  usuarios = usuarios.filter(u => u.id !== id);

  res.json({ mensaje: 'Usuario eliminado correctamente' });
};

// Exportamos las funciones para usarlas en las rutas
module.exports = {
  obtenerUsuarios,
  obtenerUsuarioPorId,
  crearUsuario,
  actualizarUsuario,
  eliminarUsuario
};