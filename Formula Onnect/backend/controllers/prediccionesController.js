const prediccionesController = require('../models/prediccionesModel.js');

// Obtener todas las predicciones
exports.getAllPredicciones = (req, res) => {
    prediccionesController.getAllPredicciones((err, results) => {
    if (err) {
      return res.status(500).json({error: 'Error al buscar en la base de datos'});
    }
    res.json(results);
  });
}

// Obtener las predicciones de un usuario por su id
exports.getPrediccionesByIdUsuario = (req, res) => {
    const idUsuario = req.params.id;

    prediccionesController.getPrediccionesByIdUsuario(idUsuario, (err, results) => {
        if (err) {
            return res.status(500).json({error: 'Error al buscar en la base de datos'});
        }
        if (results.length === 0) {
            return res.status(404).json({error: 'Predicciones no encontradas'});
        }
        res.json(results);
    });
}

// Crear una nueva predicción
exports.createPredicciones = (req, res) => {
    const predicciones = req.body;

    prediccionesController.createPredicciones(predicciones, (err, results) => {
        if (err) {
            return res.status(500).json({error: 'Error al crear en la base de datos'});
        }
        res.status(201).json({ message: 'Predicción creada exitosamente.', id: results.insertId });
    });
};