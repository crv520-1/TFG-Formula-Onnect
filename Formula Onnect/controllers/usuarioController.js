const usuarioModel = require('../models/usuarioModel.js');

// Obtener todos los usuarios
exports.getAllUsuarios = (req, res) => {
    usuarioModel.getAllUsuarios((err, results) => {
    if (err) {
      return res.status(500).json({error: 'Error al buscar en la base de datos'});
    }
    res.json(results);
  });
};

// Obtener un usuario por su id
exports.getUsuarioById = (req, res) => {
    const idUsuario = req.params.id;

    usuarioModel.getUsuarioById(idUsuario, (err, results) => {
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
exports.getUsuarioByNickName = (req, res) => {
    const nickName = req.params.nickName;

    usuarioModel.getUsuarioById(nickName, (err, results) => {
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
exports.createUsuario = (req, res) => {
    const usuario = req.body;

    usuarioModel.createUsuario(usuario, (err, results) => {
        if (err) {
            return res.status(500).json({error: 'Error al crear en la base de datos'});
        }
        res.status(201).json({ message: 'Usuario creado exitosamente.', id: results.insertId });
    });
};