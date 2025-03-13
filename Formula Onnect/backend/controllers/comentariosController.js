const comentariosController = require('../models/comentariosModel.js');

// Obtener todos los comentarios
exports.getAllComentarios = (req, res) => {
    comentariosController.getAllComentarios((err, results) => {
    if (err) {
      return res.status(500).json({error: 'Error al buscar en la base de datos'});
    }
    res.json(results);
  });
}

// Obtener un comentario por su id
exports.getComentariosByIdComentario = (req, res) => {
    const idComentarios = req.params.id;

    comentariosController.getComentariosByIdComentario(idComentarios, (err, results) => {
        if (err) {
            return res.status(500).json({error: 'Error al buscar en la base de datos'});
        }
        if (results.length === 0) {
            return res.status(404).json({error: 'Comentario no encontrado'});
        }
        res.json(results);
    });
}

// Obtener los comentarios de una publicacion por su id
exports.getComentariosByIdPublicacion = (req, res) => {
    const post = req.params.id;

    comentariosController.getComentariosByIdPublicacion(post, (err, results) => {
        if (err) {
            return res.status(500).json({error: 'Error al buscar en la base de datos'});
        }
        if (results.length === 0) {
            return res.status(404).json({error: 'Comentarios no encontrados'});
        }
        res.json(results);
    });
}

// Crear un nuevo comentario
exports.createComentarios = (req, res) => {
    const comentario = req.body;

    comentariosController.createComentarios(comentario, (err, results) => {
        if (err) {
            return res.status(500).json({error: 'Error al crear en la base de datos'});
        }
        res.status(201).json({ message: 'Comentario creado exitosamente.', id: results.insertId });
    });
};