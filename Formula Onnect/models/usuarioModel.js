const db = require('../config/db');

// Obtener todos los ususarios
exports.getAllUsuarios = (callback) => {
  const query = 'SELECT * FROM Usuario';
  db.query(query, callback);
};

// Obtener un usuario por su id
exports.getUsuarioById = (id, callback) => {
  const query = 'SELECT * FROM Usuario WHERE idUsuario = ?';
  db.query(query, [idUsuario], callback);
};

// Obtener un usuario por su nickName
exports.getUsuarioByNickName = (id, callback) => {
    const query = 'SELECT * FROM Usuario WHERE nickName = ?';
    db.query(query, [nickName], callback);
  };

// Crear un nuevo usuario
exports.createUsuario = (usuario, callback) => {
  const query = 'INSERT INTO Usuario (nickName, nombreCompleto, email, contrasena, pilotoFav, equipoFav, circuitoFav, fotoPerfil) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
  const values = [usuario.nickName, usuario.nombreCompleto, usuario.email, usuario.contrasena, usuario.pilotoFav, usuario.equipoFav, usuario.circuitoFav, usuario.fotoPerfil];
  db.query(query, values, callback);
};