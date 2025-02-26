const meGustaController = require('../models/meGustaModel.js');

// Obtener todos los me gusta
exports.getAllMeGusta = (req, res) => {
    meGustaController.getAllMeGusta((err, results) => {
    if (err) {
      return res.status(500).json({error: 'Error al buscar en la base de datos'});
    }
    res.json(results);
  });
}

// Obtener un me gusta por su id
exports.getMeGustaById = (req, res) => {
    const idmeGusta = req.params.id;

    meGustaController.getMeGustaById(idmeGusta, (err, results) => {
        if (err) {
            return res.status(500).json({error: 'Error al buscar en la base de datos'});
        }
        if (results.length === 0) {
            return res.status(404).json({error: 'Me gusta no encontrado'});
        }
        res.json(results);
    });
}

// Obtener los "me gusta" por idElemento y tipoElemento
exports.getMeGustaByElementoYTipo = (req, res) => {
    const idElemento = req.params.idElemento;
    const tipoElemento = req.params.tipoElemento;

    meGustaController.getMeGustaByElementoYTipo(idElemento, tipoElemento, (err, results) => {
        if (err) {
            return res.status(500).json({error: 'Error al buscar en la base de datos'});
        }
        if (results.length === 0) {
            return res.status(404).json({error: 'Me gusta no encontrado'});
        }
        res.json(results);
    });
}

// Crear un nuevo me gusta
exports.createMeGusta = (req, res) => {
    const meGusta = req.body;

    meGustaController.createMeGusta(meGusta, (err, results) => {
        if (err) {
            return res.status(500).json({error: 'Error al crear en la base de datos'});
        }
        res.status(201).json({ message: 'Me gusta creado exitosamente.', id: results.insertId });
    });
}