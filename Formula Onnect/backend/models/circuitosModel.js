const db = require('../config/db');

// Obtener todos los circuitos
exports.getAllCircuitos = async () => {
  try {
    const [rows] = await db.query("SELECT * FROM circuitos");
    return rows;
  } catch (error) {
    throw error;
  }
};

// Obtener un circuito por su id
exports.getCircuitosByIdCircuito = async (idCircuitos) => {
  const query = 'SELECT * FROM Circuitos WHERE idCircuitos = ?';
  const [rows] = await db.query(query, [idCircuitos]);
  if (rows.length === 0) {
    throw new Error('Circuito no encontrado');
  }
  return rows[0];
};

// Verificar si un circuito ya existe
exports.circuitoExiste = async (circuitId) => {
  const query = 'SELECT COUNT(*) as count FROM Circuitos WHERE circuitId = ?';
  const [rows] = await db.query(query, [circuitId]);
  return rows[0].count > 0;
};

// Almacenar un nuevo circuito
exports.postCircuitos = async (circuito) => {
  const query = 'INSERT INTO Circuitos (circuitId, nombreCircuito, urlCircuito, pais, isoPais, ciudad, primeraCarrera, ultimaCarrera, longitudCircuito, vueltas, recordPista, URLRecords) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
  const values = [circuito.circuitId, circuito.nombreCircuito, circuito.urlCircuito, circuito.pais, circuito.isoPais, circuito.ciudad, circuito.primeraCarrera, circuito.ultimaCarrera, circuito.longitudCircuito, circuito.vueltas, circuito.recordPista, circuito.URLRecords];
  try {
    const [result] = await db.query(query, values);
    return result;
  } catch (err) {
    console.error('Error al ejecutar la consulta SQL:', err); // Registrar el error
    throw err;
  }
};