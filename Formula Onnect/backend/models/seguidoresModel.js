const db = require('../config/db');

// Obtener todos los ususarios
exports.getAllSeguidores = async () => {
  try {
    const [rows] = await db.query("SELECT * FROM Seguidores");
    return rows;
  } catch (error) {
    throw error;
  }
};

// Obtener a quien sigo
exports.getAllSigo = async (idSeguidor) => {
  try {
    const [rows] = await db.query('SELECT * FROM Seguidores WHERE idSeguidor = ?', [idSeguidor]);
    return rows;
  } catch (error) {
    console.error("Error en la consulta de usuario:", error);
    throw error;
  }
};

// Obtener quien me sigue
exports.getAllMeSiguen = async (idSiguiendo) => {
  try {
    const [rows] = await db.query('SELECT * FROM Seguidores WHERE idSeguido = ?', [idSiguiendo]);
    return rows;
  } catch (error) {
    console.error("Error en la consulta de usuario:", error);
    throw error;
  }
};

// Obtener si sigo a un usuario
exports.getSeguimiento = async (idSeguidor, idSeguido) => {
  try {
    const [rows] = await db.query('SELECT * FROM Seguidores WHERE idSeguidor = ? AND idSeguido = ?', [idSeguidor, idSeguido]);
    return rows;
  } catch (error) {
    console.error("Error en la consulta de usuario:", error);
    throw error;
  }
};

// Crear un nuevo usuario
exports.createSeguimiento = async (seguidores) => {
  const query = 'INSERT INTO Seguidores (idSeguidor, idSeguido) VALUES (?, ?)';
  const values = [seguidores.idSeguidor, seguidores.idSeguido];
  try {
    const [result] = await db.query(query, values);
    return result.insertId;
  } catch (error) {
    console.error("Error al crear el usuario:", error);
    throw error;
  }
};

// Dejar de seguir a un usuario
exports.deleteSeguimiento = async (idSeguidor, idSeguido) => {
  const query = 'DELETE FROM Seguidores WHERE idSeguidor = ? AND idSeguido = ?';
  const values = [idSeguidor, idSeguido];
  try {
    const [result] = await db.query(query, values);
    return result.affectedRows;
  } catch (error) {
    console.error("Error al dejar de seguir al usuario:", error);
    throw error;
  }
};

// Contador de seguidores
exports.countSeguidores = async (idSeguido) => {
  try {
    const [rows] = await db.query('SELECT COUNT(*) FROM Seguidores WHERE idSeguido = ?', [idSeguido]);
    return rows[0];
  } catch (error) {
    console.error("Error en la consulta de seguidores:", error);
    throw error;
  }
};

// Contador de siguiendo
exports.countSiguiendo = async (idSeguidor) => {
  try {
    const [rows] = await db.query('SELECT COUNT(*) FROM Seguidores WHERE idSeguidor = ?', [idSeguidor]);
    return rows[0];
  } catch (error) {
    console.error("Error en la consulta de seguidores:", error);
    throw error;
  }
};