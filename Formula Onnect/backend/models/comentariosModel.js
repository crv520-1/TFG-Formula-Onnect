const db = require('../config/db');

// Obtener todos los comentarios
exports.getAllComentarios = async () => {
  try {
    const [rows] = await db.query('SELECT * FROM Comentarios');
    return rows;
  } catch (error) {
    throw error;
  }
};

// Obtener un comentario por su id
exports.getComentariosByIdComentario = async (idComentarios) => {
  try {
    const [rows] = await db.query('SELECT * FROM Comentarios WHERE idComentarios = ?', [idComentarios]);
    return rows[0];
  } catch (error) {
    throw error;
  }
};

// Obtener los comentarios de una publicacion por su id
exports.getComentariosByIdPublicacion = async (post) => {
  try {
    const [rows] = await db.query('SELECT * FROM Comentarios WHERE post = ?', [post]);
    return rows;
  } catch (error) {
    throw error;
  }
};

// Crear un nuevo comentario
exports.createComentarios = async (comentario) => {
  const query = 'INSERT INTO Comentarios (text, user, post) VALUES (?, ?, ?)';
  const values = [comentario.text, comentario.user, comentario.post];
  try {
    const [result] = await db.query(query, values);
    return result.insertId;
  } catch (error) {
    throw error;
  }
};