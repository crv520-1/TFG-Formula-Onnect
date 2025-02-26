const db = require('../config/db');

// Obtener todas las predicciones
exports.getAllPredicciones = (callback) => {
  const query = 'SELECT * FROM Predicciones';
  db.query(query, callback);
};

// Obtener la predicción de un usuario por su id
exports.getPrediccionesByIdUsuario = (id, callback) => {
  const query = 'SELECT * FROM Predicciones WHERE idUsuario = ?';
  db.query(query, [id], callback);
};

// Crear una nueva predicción
exports.createPublicaciones = (usuario, callback) => {
  const query = 'INSERT INTO Usuario (idPublicaciones, texto, usuario) VALUES (?, ?, ?)';
  const values = [predicciones.texto, predicciones.usuario];
  db.query(query, values, callback);
};