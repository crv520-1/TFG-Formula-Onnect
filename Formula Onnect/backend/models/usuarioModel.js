const db = require('../config/db');
const bcrypt = require('bcrypt');
const saltRounds = 10;

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

// Obtener un usuario por su nickName para el login
exports.getUsuarioByNickNameForLogin = async (nickName) => {
  try {
    const [rows] = await db.query('SELECT * FROM Usuario WHERE nickName = ?', [nickName]);
    return rows[0];
  } catch (error) {
    console.error("Error en la consulta de usuario:", error);
    throw error;
  }
};

// Crear un nuevo usuario (ahora con async/await)
exports.createUsuario = async (usuario) => {
  const hashedPassword = await bcrypt.hash(usuario.contrasena, saltRounds);
  const query = 'INSERT INTO Usuario (nickName, nombreCompleto, email, contrasena, pilotoFav, equipoFav, circuitoFav, fotoPerfil) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
  const values = [usuario.nickName, usuario.nombreCompleto, usuario.email, hashedPassword, usuario.pilotoFav, usuario.equipoFav, usuario.circuitoFav, usuario.fotoPerfil];

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
  // Hashear la contraseña solo si se proporciona una nueva
  if (usuario.contrasena) {
    const hashedPassword = await bcrypt.hash(usuario.contrasena, saltRounds);
    const query = 'UPDATE Usuario SET nickName = ?, nombreCompleto = ?, email = ?, contrasena = ?, pilotoFav = ?, equipoFav = ?, circuitoFav = ?, fotoPerfil = ? WHERE idUsuario = ?';
    const values = [usuario.nickName, usuario.nombreCompleto, usuario.email, hashedPassword, usuario.pilotoFav, usuario.equipoFav, usuario.circuitoFav, usuario.fotoPerfil, idUsuario];

    try {
      const [result] = await db.query(query, values);
      return result.affectedRows;
    } catch (error) {
      console.error("Error al actualizar el usuario:", error);
      throw error;
    }
  } else {
    // Actualizar sin cambiar la contraseña
    const query = 'UPDATE Usuario SET nickName = ?, nombreCompleto = ?, email = ?, contrasena = ?, pilotoFav = ?, equipoFav = ?, circuitoFav = ?, fotoPerfil = ? WHERE idUsuario = ?';
    const values = [usuario.nickName, usuario.nombreCompleto, usuario.email, usuario.contrasena, usuario.pilotoFav, usuario.equipoFav, usuario.circuitoFav, usuario.fotoPerfil, idUsuario];
    
    try {
      const [result] = await db.query(query, values);
      return result.affectedRows;
    } catch (error) {
      console.error("Error al actualizar el usuario:", error);
      throw error;
    }
  }
};
