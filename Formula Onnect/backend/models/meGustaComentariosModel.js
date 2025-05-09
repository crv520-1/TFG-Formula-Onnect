const db = require('../config/db');

// Obtener todos los me gusta de comentarios
exports.getAllMeGustaComentarios = async () => {
  try {
    const [rows] = await db.query('SELECT * FROM MeGustaComentarios');
    return rows;
  } catch (error) {
    throw error;
  }
};

// Obtener los me gusta por el ID del comentario
exports.getMeGustaComentariosById = async (idComentario) => {
  try {
    const [rows] = await db.query('SELECT * FROM MeGustaComentarios WHERE idComent = ?', [idComentario]);
    return rows;
  } catch (error) {
    console.error("Error en la consulta de me gusta de comentarios:", error);
    throw error;
  }
};

// Obtener el numero total de me gusta de un comentario
exports.getMeGustaComentariosCount = async (idComentario) => {
  try {
    const [rows] = await db.query('SELECT COUNT(*) AS contador FROM MeGustaComentarios WHERE idComent = ?', [idComentario]);
    return rows;
  } catch (error) {
    console.error("Error en la consulta de me gusta de comentarios:", error);
    throw error;
  }
};

// Obtener si un usuario ya le dio me gusta a un comentario
exports.getMeGustaComentariosByUser = async (iDusuario, idComent) => {
  try {
    const [rows] = await db.query('SELECT * FROM MeGustaComentarios WHERE iDusuario = ? AND idComent = ?', [iDusuario, idComent]);
    return rows;
  } catch (error) {
    console.error("Error en la consulta de me gusta de comentarios:", error);
    throw error;
  }
};

// Crear un nuevo me gusta de comentario
exports.createMeGustaComentarios = async (meGustaComentarios) => {
  const query = 'INSERT INTO MeGustaComentarios (iDusuario, idComent) VALUES (?, ?)';
  const values = [meGustaComentarios.iDusuario, meGustaComentarios.idComent];

  try {
    const [result] = await db.query(query, values);
    return result.insertId;
  }
  catch (error) {
    console.error("Error al crear el me gusta de comentario:", error);
    throw error;
  }
};

// Eliminar un me gusta de comentario
exports.deleteMeGustaComentarios = async (iDusuario, idComent) => {
  try {
    const [result] = await db.query('DELETE FROM MeGustaComentarios WHERE iDusuario = ? AND idComent = ?', [iDusuario, idComent]);
    return result.affectedRows;
  }
  catch (error) {
    console.error("Error al eliminar el me gusta de comentario:", error);
    throw error;
  }
};
