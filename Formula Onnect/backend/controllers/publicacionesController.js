const publicacionesController = require('../models/publicacionesModel.js');

// Obtener todas las publicaciones
exports.getAllPublicaciones = async (req, res) => {
    try {
        const publicaciones = await publicacionesController.getAllPublicaciones();
        res.json(publicaciones);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Obtener las publicaciones de un usuario por su id
exports.getPublicacionesByIdUsuario = async (req, res) => {
    const idUsuario = req.params.id;

    try {
        const publicaciones = await publicacionesController.getPublicacionesByIdUsuario(idUsuario);
        if (publicaciones.length === 0) {
            return res.status(404).json({ error: 'Publicaciones no encontradas' });
        }
        return res.json(publicaciones);
    }
    catch (error) {
        console.error("Error en la API:", error);
        return res.status(500).json({ error: 'Error al buscar en la base de datos' });
    }
};

// Obtener una publicacion por su id
exports.getPublicacionById = async (req, res) => {
    const idPublicacion = req.params.id;

    try {
        const publicacion = await publicacionesController.getPublicacionById(idPublicacion);
        if (!publicacion) {
            return res.status(404).json({ error: 'Publicacion no encontrada' });
        }
        return res.json(publicacion);
    }
    catch (error) {
        console.error("Error en la API:", error);
        return res.status(500).json({ error: 'Error al buscar en la base de datos' });
    }
};

// Crear una nueva publicacion
exports.createPublicaciones = async (req, res) => {
    try {
        const publicacion = req.body;
        const insertId = await publicacionesController.createPublicaciones(publicacion);
        res.status(201).json({ message: 'Publicacion creada exitosamente.', id: insertId });
    } catch (error) {
        console.error("Error en createPublicaciones:", error);
        res.status(500).json({ error: 'Error al crear la publicacion en la base de datos.' });
    }
};

// Contar publicaciones de un usuario
exports.countPublicacionesByIdUsuario = async (req, res) => {
    const idUsuario = req.params.id;

    try {
        const publicaciones = await publicacionesController.countPublicacionesByIdUsuario(idUsuario);
        res.json(publicaciones);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};