const seguidoresModel = require('../models/seguidoresModel.js');

// Obtener todos los usuarios
exports.getAllSeguidores = async (req, res) => {
    try {
        const seguidores = await seguidoresModel.getAllSeguidores();
        res.json(seguidores);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Obtener un usuario por su id
exports.getAllSigo = async (req, res) => {
    const idSeguidor = req.params.id;

    try {
        const sigo = await seguidoresModel.getAllSigo(idSeguidor);
        if (sigo.length === 0) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }
        return res.json(sigo[0]);
    } catch (error) {
        console.error("Error en la API:", error);
        return res.status(500).json({ error: 'Error al buscar en la base de datos' });
    }
}

// Obtener un usuario por su nickName
exports.getAllMeSiguen = async (req, res) => {
    const idSeguido = req.params.nickName;

    try {
        const meSiguen = await seguidoresModel.getAllMeSiguen(idSeguido);
        if (meSiguen.length === 0) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }
        return res.json(meSiguen[0]);
    } catch (error) {
        console.error("Error en la API:", error);
        return res.status(500).json({ error: 'Error al buscar en la base de datos' });
    }
}

// Obtener si sigo a un usuario
exports.getSeguimiento = async (req, res) => {
    const idSeguidor = req.params.idSeguidor;
    const idSeguido = req.params.idSeguido;

    try {
        const seguimiento = await seguidoresModel.getSeguimiento(idSeguidor, idSeguido);
        if (seguimiento.length === 0) {
            return res.status(404).json({ error: 'Seguimiento no encontrado' });
        }
        return res.json(seguimiento[0]);
    } catch (error) {
        console.error("Error en getSeguimiento:", error);
        return res.status(500).json({ error: 'Error al buscar en la base de datos' });
    }
}

// Crear un nuevo usuario
exports.createSeguimiento = async (req, res) => {
    const seguimiento = req.body;

    try {
        const insertId = await seguidoresModel.createSeguimiento(seguimiento);
        res.status(201).json({ message: 'Seguimiento creado exitosamente.', id: insertId });
    } catch (error) {
        console.error("Error en createSeguimiento:", error);
        res.status(500).json({ error: 'Error al crear el seguimiento en la base de datos.' });
    }
};

// Dejar de seguir a un usuario
exports.deleteSeguimiento = async (req, res) => {
    const idSeguidor = req.params.idSeguidor;
    const idSeguido = req.params.idSeguido;

    try {
        const affectedRows = await seguidoresModel.deleteSeguimiento(idSeguidor, idSeguido);
        if (affectedRows === 0) {
            return res.status(404).json({ error: 'Seguimiento no encontrado' });
        }
        return res.json({ message: 'Seguimiento eliminado exitosamente.' });
    } catch (error) {
        console.error("Error en deleteSeguimiento:", error);
        return res.status(500).json({ error: 'Error al eliminar el seguimiento en la base de datos.' });
    }
}

// Contador de seguidores
exports.countSeguidores = async (req, res) => {
    const idSeguido = req.params.id;

    try {
        const count = await seguidoresModel.countSeguidores(idSeguido);
        res.json(count);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Contador de siguiendo
exports.countSiguiendo = async (req, res) => {
    const idSeguidor = req.params.id;

    try {
        const count = await seguidoresModel.countSiguiendo(idSeguidor);
        res.json(count);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}