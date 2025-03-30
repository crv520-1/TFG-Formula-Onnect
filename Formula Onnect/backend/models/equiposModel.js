const db = require('../config/db');

// Obtener todos los equipos
exports.getAllEquipos = async () => {
  try {
    const [rows] = await db.query("SELECT * FROM equipos");
    return rows;
  } catch (error) {
    throw error;
  }
};

// Obtener un equipo por su id
exports.getEquiposByIdEquipo = async (idEquipos) => {
  const query = 'SELECT * FROM Equipos WHERE idEquipos = ?';
  const [rows] = await db.query(query, [idEquipos]);
  if (rows.length === 0) {
    throw new Error('Equipo no encontrado');
  }
  return rows[0];
};

// Verificar si un equipo ya existe
exports.equipoExiste = async (constructorId) => {
  const query = 'SELECT COUNT(*) as count FROM Equipos WHERE constructorId = ?';
  const [rows] = await db.query(query, [constructorId]);
  return rows[0].count > 0;
};

// Almacenar un nuevo equipo
exports.postEquipos = async (equipo, callback) => {
  const query = 'INSERT INTO Equipos (constructorId, nombreEquipo, nacionalidadEquipo, urlEquipo, isoNacEqui, urlCastellano) VALUES (?, ?, ?, ?, ?, ?)';
  const values = [equipo.constructorId, equipo.nombreEquipo, equipo.nacionalidadEquipo, equipo.urlEquipo, equipo.isoNacEqui, equipo.urlCastellano];
  try {
    const [result] = await db.query(query, values);
    return result;
  } catch (err) {
    throw err;
  }
};