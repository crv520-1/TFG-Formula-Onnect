const meGustaComentariosModel = require('../models/meGustaComentariosModel.js');

// Obtener todos los me gusta de comentarios
exports.getAllMeGustaComentarios = async (req, res) => {
    try {
        const meGustaComentarios = await meGustaComentariosModel.getAllMeGustaComentarios();
        res.json(meGustaComentarios);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// Obtener los me gusta por el ID del comentario
exports.getMeGustaComentariosById = async (req, res) => {
    const { idComentario } = req.params;

    try {
        const meGustaComentarios = await meGustaComentariosModel.getMeGustaComentariosById(idComentario);
        if (meGustaComentarios.length === 0) {
            return res.status(404).json({ error: 'Me gusta no encontrado' });
        }
        return res.json(meGustaComentarios);
    } catch (error) {
        console.error("Error en la API:", error);
        return res.status(500).json({ error: 'Error al buscar en la base de datos' });
    }
}

// Obtener el numero total de me gusta de un comentario
exports.getMeGustaComentariosCount = async (req, res) => {
    const { idComentario } = req.params;

    try {
        const meGustaComentarios = await meGustaComentariosModel.getMeGustaComentariosCount(idComentario);
        if (meGustaComentarios.length === 0) {
            return res.status(404).json({ error: 'Me gusta no encontrado' });
        }
        return res.json(meGustaComentarios);
    } catch (error) {
        console.error("Error en la API:", error);
        return res.status(500).json({ error: 'Error al buscar en la base de datos' });
    }
}

// Crear un nuevo me gusta de comentario
exports.createMeGustaComentarios = async (req, res) => {
    try {
        const meGustaComentarios = req.body;
        const insertId = await meGustaComentariosModel.createMeGustaComentarios(meGustaComentarios);
        res.status(201).json({ message: 'Me gusta de comentario creado exitosamente.', id: insertId });
    } catch (error) {
        console.error("Error en createMeGustaComentarios:", error);
        res.status(500).json({ error: 'Error al crear el me gusta de comentario en la base de datos.' });
    }
}

// Eliminar un me gusta de comentario
exports.deleteMeGustaComentarios = async (req, res) => {
    const { iDusuario, idComent } = req.params;

    try {
        const affectedRows = await meGustaComentariosModel.deleteMeGustaComentarios(iDusuario, idComent);
        if (affectedRows === 0) {
            return res.status(404).json({ error: 'Me gusta de comentario no encontrado' });
        }
        return res.json({ message: 'Me gusta de comentario eliminado exitosamente.' });
    } catch (error) {
        console.error("Error en deleteMeGustaComentarios:", error);
        res.status(500).json({ error: 'Error al eliminar el me gusta de comentario en la base de datos.' });
    }
}