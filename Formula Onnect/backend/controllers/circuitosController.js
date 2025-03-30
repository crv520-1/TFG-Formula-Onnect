const circuitosController = require('../models/circuitosModel.js');

// Obtener todos los circuitos
exports.getAllCircuitos = async (req, res) => {
  try {
    const circuitos = await circuitosController.getAllCircuitos();
    res.json(circuitos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener un circuito por su id
exports.getCircuitosByIdCircuito = async (req, res) => {
    const idCircuitos = req.params.id;
    try {
        const circuito = await circuitosController.getCircuitosByIdCircuito(idCircuitos);
        res.json(circuito);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
}

// Almacenar un nuevo circuito
exports.postCircuitos = (req, res) => {
    const circuito = req.body;

    circuitosController.postCircuitos(circuito, (err, results) => {
        if (err) {
            return res.status(500).json({error: 'Error al crear en la base de datos'});
        }
        res.status(201).json({ message: 'Circuito creado exitosamente.', id: results.insertId });
    });
}