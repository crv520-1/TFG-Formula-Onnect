const db = require('../config/db');

// Obtener todos los ususarios
exports.getAllUsuarios = async () => {
  try {
    const [rows] = await db.query("SELECT * FROM usuario");
    return rows;
  } catch (error) {
    throw error;
  }
};

// Obtener un usuario por su id
exports.getUsuarioById = async (idUsuario) => {
  try {
    const [rows] = await db.query('SELECT * FROM Usuario WHERE idUsuario = ?', [idUsuario]);
    return rows;
  } catch (error) {
    console.error("Error en la consulta de usuario:", error);
    throw error;
  }
};


// Obtener un usuario por su nickName
exports.getUsuarioByNickName = (nickName, callback) => {
  const query = 'SELECT * FROM Usuario WHERE nickName = ?';
  db.query(query, [nickName], callback);
};

// Crear un nuevo usuario (ahora con async/await)
exports.createUsuario = async (usuario) => {
  const query = 'INSERT INTO Usuario (nickName, nombreCompleto, email, contrasena, pilotoFav, equipoFav, circuitoFav, fotoPerfil) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
  const values = [usuario.nickName, usuario.nombreCompleto, usuario.email, usuario.contrasena, usuario.pilotoFav, usuario.equipoFav, usuario.circuitoFav, usuario.fotoPerfil];

  try {
    const [result] = await db.query(query, values);
    return result.insertId;
  } catch (error) {
    console.error("Error al crear el usuario:", error);
    throw error;
  }
};

// Actualizar un usuario (ahora con async/await)
exports.updateUsuario = async (idUsuario, usuario) => {
  const query = 'UPDATE Usuario SET nickName = ?, nombreCompleto = ?, email = ?, contrasena = ?, pilotoFav = ?, equipoFav = ?, circuitoFav = ?, fotoPerfil = ? WHERE idUsuario = ?';
  const values = [usuario.nickName, usuario.nombreCompleto, usuario.email, usuario.contrasena, usuario.pilotoFav, usuario.equipoFav, usuario.circuitoFav, usuario.fotoPerfil, idUsuario];

  try {
    const [result] = await db.query(query, values);
    return result.affectedRows;
  } catch (error) {
    console.error("Error al actualizar el usuario:", error);
    throw error;
  }
};
