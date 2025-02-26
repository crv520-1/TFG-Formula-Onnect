const pilotosModel = require('../models/pilotosModel');

// Obtener todos los pilotos
exports.getAllPilotos = async (req, res) => {
  try {
    const pilotos = await pilotosModel.getAllPilotos();
    res.json(pilotos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener un piloto por su id
exports.getPilotosByIdPiloto = (req, res) => {
    const idPilotos = req.params.id;

    pilotosModel.getPilotosByIdPiloto(idPilotos, (err, results) => {
        if (err) {
            return res.status(500).json({error: 'Error al buscar en la base de datos'});
        }
        if (results.length === 0) {
            return res.status(404).json({error: 'Piloto no encontrado'});
        }
        res.json(results);
    });
}

// Almacenar un nuevo piloto
exports.postPilotos = (req, res) => {
    const piloto = req.body;

    pilotosModel.postPilotos(piloto, (err, results) => {
        if (err) {
            return res.status(500).json({error: 'Error al crear en la base de datos'});
        }
        res.status(201).json({ message: 'Piloto creado exitosamente.', id: results.insertId });
    });
};