const seguidoresModel = require('../models/seguidoresModel.js');

// Obtener todos los usuarios
exports.getAllSeguidores = (req, res) => {
  seguidoresModel.getAllSeguidores((err, results) => {
    if (err) {
      return res.status(500).json({error: 'Error al buscar en la base de datos'});
    }
    res.json(results);
  });
};

// Obtener un usuario por su id
exports.getAllSigo = (req, res) => {
    const idSeguidor = req.params.id;

    seguidoresModel.getAllSigo(idSeguidor, (err, results) => {
        if (err) {
            return res.status(500).json({error: 'Error al buscar en la base de datos'});
        }
        if (results.length === 0) {
            return res.status(404).json({error: 'Usuario no encontrado'});
        }
        res.json(results[0]);
    });
}

// Obtener un usuario por su nickName
exports.getAllMeSiguen = (req, res) => {
    const idSeguido = req.params.nickName;

    seguidoresModel.getAllMeSiguen(idSeguido, (err, results) => {
        if (err) {
            return res.status(500).json({error: 'Error al buscar en la base de datos'});
        }
        if (results.length === 0) {
            return res.status(404).json({error: 'Usuario no encontrado'});
        }
        res.json(results[0]);
    });
}

// Crear un nuevo usuario
exports.createSeguimiento = (req, res) => {
    const seguimiento = req.body;

    seguidoresModel.createSeguimiento(seguimiento, (err, results) => {
        if (err) {
            return res.status(500).json({error: 'Error al crear en la base de datos'});
        }
        res.status(201).json({ message: 'Seguimiento creado exitosamente.', id: results.insertId });
    });
};