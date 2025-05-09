const db = require('../config/db');

// Obtener todos los me gusta
exports.getAllMeGusta = async () => {
  try {
    const [rows] = await db.query('SELECT * FROM MeGusta');
    return rows;
  } catch (error) {
    throw error;
  }
};

// Obtener todos los megusta por idElemento
exports.getAllMeGustaById = async (idElemento) => {
  try {
    const [rows] = await db.query('SELECT * FROM MeGusta WHERE idElemento = ?', [idElemento]);
    return rows;
  } catch (error) {
    console.error("Error en la consulta de me gusta:", error);
    throw error;
  }
};

// Obtener los "me gusta" por idElemento y tipoElemento
exports.getMeGustaById = async (idElemento) => {
  try {
    const [rows] = await db.query('SELECT idElemento, COUNT(*) AS contador FROM MeGusta WHERE idElemento = ?', [idElemento]);
    return rows;
  } catch (error) {
    console.error("Error en la consulta de me gusta:", error);
    throw error;
  }
};

// Obtener si el usuario ya le dio me gusta a un elemento
exports.getMeGustaByUser = async (idUser, idElemento) => {
  try {
    const [rows] = await db.query('SELECT * FROM MeGusta WHERE idUser = ? AND idElemento = ?', [idUser, idElemento]);
    return rows[0] || null;
  } catch (error) {
    console.error("Error en la consulta de me gusta por usuario:", error);
    throw error;
  }
};

// Crear un nuevo me gusta
exports.createMeGusta = async (meGusta) => {
  const query = 'INSERT INTO MeGusta (idUser, idElemento) VALUES (?, ?)';
  const values = [meGusta.idUser, meGusta.idElemento, meGusta.tipoElemento];

  try {
    const [result] = await db.query(query, values);
    return result.insertId;
  }
  catch (error) {
    console.error("Error al crear el me gusta:", error);
    throw error;
  }
};

// Eliminar un me gusta
exports.deleteMeGusta = async (idUser, idElemento) => {
  try {
    const [result] = await db.query('DELETE FROM MeGusta WHERE idUser = ? AND idElemento = ?', [idUser, idElemento]);
    return result.affectedRows;
  }
  catch (error) {
    console.error("Error al eliminar el me gusta:", error);
    throw error;
  }
};