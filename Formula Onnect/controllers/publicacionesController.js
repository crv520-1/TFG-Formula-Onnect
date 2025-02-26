const publicacionesController = require('../models/publicacionesModel.js');

// Obtener todas las publicaciones
exports.getAllPublicaciones = (req, res) => {
    publicacionesController.getAllPublicaciones((err, results) => {
    if (err) {
      return res.status(500).json({error: 'Error al buscar en la base de datos'});
    }
    res.json(results);
  });
}

// Obtener las publicaciones de un usuario por su id
exports.getPublicacionesByIdUsuario = (req, res) => {
    const idUsuario = req.params.id;

    publicacionesController.getPublicacionesByIdUsuario(idUsuario, (err, results) => {
        if (err) {
            return res.status(500).json({error: 'Error al buscar en la base de datos'});
        }
        if (results.length === 0) {
            return res.status(404).json({error: 'Publicaciones no encontradas'});
        }
        res.json(results);
    });
}

// Crear una nueva publicacion
exports.createPublicaciones = (req, res) => {
    const publicacion = req.body;

    publicacionesController.createPublicaciones(publicacion, (err, results) => {
        if (err) {
            return res.status(500).json({error: 'Error al crear en la base de datos'});
        }
        res.status(201).json({ message: 'Publicacion creada exitosamente.', id: results.insertId });
    });
};