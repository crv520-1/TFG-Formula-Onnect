const db = require('../config/db');

// Obtener todos los me gusta
exports.getAllMeGusta = (callback) => {
  const query = 'SELECT * FROM MeGusta';
  db.query(query, callback);
};

// Obtener un me gusta por su id
exports.getMeGustaById = (idmeGusta, callback) => {
  const query = 'SELECT * FROM MeGusta WHERE idmeGusta = ?';
  db.query(query, [idmeGusta], callback);
};

// Obtener los "me gusta" por idElemento y tipoElemento
exports.getMeGustaByElementoYTipo = (idElemento, tipoElemento, callback) => {
    const query = 'SELECT * FROM MeGusta WHERE idElemento = ? AND tipoElemento = ?';
    db.query(query, [idElemento, tipoElemento], callback);
};  

// Crear un nuevo me gusta
exports.createMeGusta = (meGusta, callback) => {
  const query = 'INSERT INTO MeGusta (idmeGusta, idUser, idElemento, tipoElemento) VALUES (?, ?, ?, ?)';
  const values = [meGusta.idUsuario, meGusta.idElemento, meGusta.tipoElemento];
  db.query(query, values, callback);
};