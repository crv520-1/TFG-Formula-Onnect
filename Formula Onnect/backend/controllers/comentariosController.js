const comentariosController = require('../models/comentariosModel.js');

// Obtener todos los comentarios
exports.getAllComentarios = async (req, res) => {
    try {
        const comentarios = await comentariosController.getAllComentarios();
        res.json(comentarios);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Obtener un comentario por su id
exports.getComentariosByIdComentario = async (req, res) => {
    const idComentarios = req.params.id;

    try {
        const comentario = await comentariosController.getComentariosByIdComentario(idComentarios);
        if (!comentario) {
            return res.status(404).json({ error: 'Comentario no encontrado' });
        }
        return res.json(comentario);
    }
    catch (error) {
        console.error("Error en la API:", error);
        return res.status(500).json({ error: 'Error al buscar en la base de datos' });
    }
};

// Obtener los comentarios de una publicacion por su id
exports.getComentariosByIdPublicacion = async (req, res) => {
    const post = req.params.id;

    try {
        const comentarios = await comentariosController.getComentariosByIdPublicacion(post);
        if (comentarios.length === 0) {
            return res.status(404).json({ error: 'Comentarios no encontrados' });
        }
        return res.json(comentarios);
    } catch {
        console.error("Error en la API:", error);
        return res.status(500).json({ error: 'Error al buscar en la base de datos' });
    }
}

// Obtener los comentarios de un comentario por el comentario padre
exports.getComentariosByComentarioPadre = async (req, res) => {
    const comentarioPadre = req.params.id;

    try {
        const comentarios = await comentariosController.getComentariosByComentarioPadre(comentarioPadre);
        if (comentarios.length === 0) {
            return res.status(404).json({ error: 'Comentarios no encontrados' });
        }
        return res.json(comentarios);
    } catch (error) {
        console.error("Error en la API:", error);
        return res.status(500).json({ error: 'Error al buscar en la base de datos' });
    }
}

// Obtener el numero de comentarios de una publicacion por el id de la publicacion
exports.getNumeroComentariosByIdPublicacion = async (req, res) => {
    const post = req.params.id;

    try {
        const numeroComentarios = await comentariosController.getNumeroComentariosByIdPublicacion(post);
        return res.json(numeroComentarios);
    } catch (error) {
        console.error("Error en la API:", error);
        return res.status(500).json({ error: 'Error al buscar en la base de datos' });
    }
}

// Obtener el numero de comentarios de un comentario por el comentario padre
exports.getNumeroComentariosByComentarioPadre = async (req, res) => {
    const comentarioPadre = req.params.id;

    try {
        const numeroComentarios = await comentariosController.getNumeroComentariosByComentarioPadre(comentarioPadre);
        return res.json(numeroComentarios);
    } catch (error) {
        console.error("Error en la API:", error);
        return res.status(500).json({ error: 'Error al buscar en la base de datos' });
    }
}

// Crear un nuevo comentario
exports.createComentarios = async (req, res) => {
    try {
        const comentario = req.body;
        const insertId = comentariosController.createComentarios(comentario);
        res.status(201).json({ message: 'Comentario creado exitosamente.', id: insertId });
    } catch (error) {
        console.error("Error en createComentarios:", error);
        res.status(500).json({ error: 'Error al crear el comentario en la base de datos.' });
    }
};