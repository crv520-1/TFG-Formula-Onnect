const db = require('../config/db');

// Obtener todos los pilotos
exports.getAllPilotos = async () => {
  try {
    const [rows] = await db.query("SELECT * FROM pilotos");
    return rows;
  } catch (error) {
    throw error;
  }
};

// Obtener un piloto por su id
exports.getPilotosByIdPiloto = async (idPilotos) => {
  const query = 'SELECT * FROM Pilotos WHERE idPilotos = ?';
  const [rows] = await db.query(query, [idPilotos]);
  if (rows.length === 0) {
    throw new Error('Piloto no encontrado');
  }
  return rows[0];
};

// Verificar si un piloto ya existe
exports.pilotoExiste = async (driverId) => {
  const query = 'SELECT COUNT(*) as count FROM Pilotos WHERE driverId = ?';
  const [rows] = await db.query(query, [driverId]);
  return rows[0].count > 0;
};

// Almacenar un nuevo piloto
exports.postPilotos = async (piloto) => {
    const query = 'INSERT INTO Pilotos (driverId, nombrePiloto, apellidoPiloto, nacionalidadPiloto, urlPiloto, isoNacPil, imagenPilotos) VALUES (?, ?, ?, ?, ?, ?, ?)';
    const values = [piloto.driverId, piloto.nombrePiloto, piloto.apellidoPiloto, piloto.nacionalidadPiloto, piloto.urlPiloto, piloto.isoNacPil, piloto.imagenPilotos];
  
    try {
      const [result] = await db.query(query, values);
      return result;
    } catch (err) {
      throw err;
    }
};
