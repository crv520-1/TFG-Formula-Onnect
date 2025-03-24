const db = require('../config/db');

// Obtener todos los ususarios
exports.getAllPublicaciones = async () => {
  try {
    const [rows] = await db.query("SELECT * FROM f1.publicaciones ORDER BY fechaPublicacion DESC;");
    return rows;
  } catch (error) {
    throw error;
  }
};

// Obtener una publicación por el id del usuario
exports.getPublicacionesByIdUsuario = async (idUsuario) => {
  try {
    const [rows] = await db.query('SELECT * FROM Publicaciones WHERE usuario = ? ORDER BY fechaPublicacion DESC', [idUsuario]);
    return rows;
  } catch (error) {
    console.error("Error en la consulta de usuario:", error);
    throw error;
  }
};

// Obtener una publicación por su id
exports.getPublicacionById = async (idPublicacion) => {
  try {
    const [rows] = await db.query('SELECT * FROM Publicaciones WHERE idPublicaciones = ?', [idPublicacion]);
    return rows[0];
  } catch (error) {
    console.error("Error en la consulta de publicación:", error);
    throw error;
  }
};

// Crear un nuevo usuario
exports.createPublicaciones = async (publicaciones) => {
  const query = 'INSERT INTO publicaciones (texto, usuario, fechaPublicacion) VALUES (?, ?, ?)';
  const values = [publicaciones.texto, publicaciones.usuario, publicaciones.fechaPublicacion];

  try {
    const [result] = await db.query(query, values);
    return result.insertId;
  } catch (error) {
    console.error("Error al crear el usuario:", error);
    throw error;
  }
};

// Contador de publicaciones de un usuario
exports.countPublicacionesByIdUsuario = async (idUsuario) => {
  try {
    const [rows] = await db.query('SELECT COUNT(*) FROM Publicaciones WHERE usuario = ?', [idUsuario]);
    return rows[0];
  } catch (error) {
    console.error("Error en la consulta de publicaciones:", error);
    throw error;
  }
};