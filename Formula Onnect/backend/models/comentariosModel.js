const db = require('../config/db');

// Obtener todos los comentarios
exports.getAllComentarios = async () => {
  try {
    const [rows] = await db.query('SELECT * FROM Comentarios');
    return rows;
  } catch (error) {
    console.log("Error en la consulta de comentarios:", error);
    throw error;
  }
};

// Obtener un comentario por su id
exports.getComentariosByIdComentario = async (idComentarios) => {
  try {
    const [rows] = await db.query('SELECT * FROM Comentarios WHERE idComentarios = ?', [idComentarios]);
    return rows[0];
  } catch (error) {
    console.log("Error en la consulta de comentario:", error);
    throw error;
  }
};

// Obtener los comentarios de una publicacion por su id
exports.getComentariosByIdPublicacion = async (post) => {
  try {
    const [rows] = await db.query('SELECT * FROM Comentarios WHERE post = ?', [post]);
    return rows;
  } catch (error) {
    console.log("Error en la consulta de comentarios:", error);
    throw error;
  }
};

// Obtener los comentarios de un comentario por el comentario padre
exports.getComentariosByComentarioPadre = async (comentarioPadre) => {
  try {
    const [rows] = await db.query('SELECT * FROM Comentarios WHERE comentarioPadre = ?', [comentarioPadre]);
    return rows;
  } catch (error) {
    console.log("Error en la consulta de comentarios:", error);
    throw error;
  }
};

// Obtener el numero de comentarios de una publicacion por el id de la publicacion
exports.getNumeroComentariosByIdPublicacion = async (post) => {
  try {
    const [rows] = await db.query('SELECT post, COUNT(*) AS contador FROM Comentarios WHERE post = ?', [post]);
    return rows[0];
  } catch (error) {
    console.log("Error en la consulta de comentarios:", error);
    throw error;
  }
};

// Obtener el numero de comentarios de un comentario por el comentario padre
exports.getNumeroComentariosByComentarioPadre = async (comentarioPadre) => {
  try {
    const [rows] = await db.query('SELECT comentarioPadre, COUNT(*) AS contador FROM Comentarios WHERE comentarioPadre = ?', [comentarioPadre]);
    return rows[0];
  } catch (error) {
    console.log("Error en la consulta de comentarios:", error);
    throw error;
  }
};

// Crear un nuevo comentario
exports.createComentarios = async (comentario) => {
  const query = 'INSERT INTO Comentarios (text, user, post, comentarioPadre) VALUES (?, ?, ?, ?)';
  const values = [comentario.text, comentario.user, comentario.post, comentario.comentarioPadre];
  try {
    const [result] = await db.query(query, values);
    return result.insertId;
  } catch (error) {
    console.log("Error al crear el comentario:", error);
    throw error;
  }
};