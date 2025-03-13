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
exports.getPilotosByIdPiloto = (idPilotos, callback) => {
  const query = 'SELECT * FROM Pilotos WHERE idPilotos = ?';
  db.query(query, [idPilotos], callback);
};

// Verificar si un piloto ya existe
exports.pilotoExiste = async (driverId) => {
  const query = 'SELECT COUNT(*) as count FROM Pilotos WHERE driverId = ?';
  const [rows] = await db.query(query, [driverId]);
  return rows[0].count > 0;
};

// Almacenar un nuevo piloto
exports.postPilotos = async (piloto) => {
    const query = 'INSERT INTO Pilotos (driverId, nombrePiloto, apellidoPiloto, nacionalidadPiloto, urlPiloto, isoNacPil) VALUES (?, ?, ?, ?, ?, ?)';
    const values = [piloto.driverId, piloto.nombrePiloto, piloto.apellidoPiloto, piloto.nacionalidadPiloto, piloto.urlPiloto, piloto.isoNacPil];
  
    try {
      const [result] = await db.query(query, values);
      return result;
    } catch (err) {
      throw err;
    }
};
