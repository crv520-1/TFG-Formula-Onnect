const db = require('../config/db');

// Obtener todos los comentarios
exports.getAllComentarios = (callback) => {
  const query = 'SELECT * FROM Comentarios';
  db.query(query, callback);
};

// Obtener un comentario por su id
exports.getComentariosByIdComentario = (idComentarios, callback) => {
  const query = 'SELECT * FROM Comentarios WHERE idComentarios = ?';
  db.query(query, [idComentarios], callback);
};

// Obtener los comentarios de una publicacion por su id
exports.getComentariosByIdPublicacion = (post, callback) => {
  const query = 'SELECT * FROM Comentarios WHERE post = ?';
  db.query(query, [post], callback);
};

// Crear un nuevo comentario
exports.createComentarios = (comentario, callback) => {
  const query = 'INSERT INTO Comentarios (idComentarios, text, user, post) VALUES (?, ?, ?, ?)';
  const values = [comentario.text, comentario.user, comentario.post];
  db.query(query, values, callback);
};