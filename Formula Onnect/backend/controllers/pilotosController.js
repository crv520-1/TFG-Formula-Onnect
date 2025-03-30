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
exports.getPilotosByIdPiloto = async (req, res) => {
    const idPilotos = req.params.id;
    try {
        const piloto = await pilotosModel.getPilotosByIdPiloto(idPilotos);
        res.json(piloto);
    } catch (error) {
        res.status(404).json({ error: 'Piloto no encontrado' });
    }
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