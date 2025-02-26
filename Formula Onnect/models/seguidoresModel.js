const db = require('../config/db');

// Obtener todos los ususarios
exports.getAllSeguidores = (callback) => {
  const query = 'SELECT * FROM Seguidores';
  db.query(query, callback);
};

// Obtener a quien sigo
exports.getAllSigo = (callback) => {
    const query = 'SELECT * FROM Seguidores WHERE idSeguidor = ?';
    db.query(query, [idSeguidor], callback);
};

// Obtener quien me sigue
exports.getAllMeSiguen = (callback) => {
    const query = 'SELECT * FROM Seguidores WHERE idSeguido = ?';
    db.query(query, [idSeguido], callback);
};

// Crear un nuevo usuario
exports.createSeguimiento = (seguidores, callback) => {
  const query = 'INSERT INTO Seguidores (idSeguidor, idSeguido, idTabla) VALUES (?, ?, ?)';
  const values = [seguidores.idSeguido, seguidores.idTabla];
  db.query(query, values, callback);
};