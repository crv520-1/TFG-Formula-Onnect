const db = require('../config/db');

// Obtener todos los ususarios
exports.getAllPublicaciones = (callback) => {
  const query = 'SELECT * FROM Publicaciones';
  db.query(query, callback);
};

// Obtener un usuario por su id
exports.getPublicacionesByIdUsuario = (idUsuario, callback) => {
  const query = 'SELECT * FROM Publicaciones WHERE idUsuario = ?';
  db.query(query, [idUsuario], callback);
};

// Crear un nuevo usuario
exports.createPublicaciones = (publicaciones, callback) => {
  const query = 'INSERT INTO publicaciones (idPublicaciones, texto, usuario) VALUES (?, ?, ?)';
  const values = [publicaciones.texto, publicaciones.usuario];
  db.query(query, values, callback);
};