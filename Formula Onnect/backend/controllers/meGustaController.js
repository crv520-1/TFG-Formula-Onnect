const meGustaController = require('../models/meGustaModel.js');

// Obtener todos los me gusta
exports.getAllMeGusta = async (req, res) => {
    try {
        const meGusta = await meGustaController.getAllMeGusta();
        res.json(meGusta);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// Obtener todos los megusta por idElemento
exports.getAllMeGustaById = async (req, res) => {
    const { idElemento } = req.params;

    try {
        const meGusta = await meGustaController.getAllMeGustaById(idElemento);
        if (meGusta.length === 0) {
            return res.json([]);
        }
        return res.json(meGusta);
    } catch (error) {
        console.error("Error en la API:", error);
        return res.status(500).json({ error: 'Error al buscar en la base de datos' });
    }
}

// Obtener los "me gusta" por idElemento y tipoElemento
exports.getMeGustaById = async (req, res) => {
    const { idElemento } = req.params;

    try {
        const meGusta = await meGustaController.getMeGustaById(idElemento);
        if (meGusta.length === 0) {
            return res.status(404).json({ error: 'Me gusta no encontrado' });
        }
        return res.json(meGusta);
    } catch (error) {
        console.error("Error en la API:", error);
        return res.status(500).json({ error: 'Error al buscar en la base de datos' });
    }
}

// Copia del anterior con modificación para Kotlin
exports.getMeGustaByIdKotlin = async (req, res) => {
    const { idElemento } = req.params;
    try {
        const meGusta = await meGustaController.getMeGustaByIdKotlin(idElemento);
        if (!meGusta) {
            return res.status(404).json(null);
        }
        return res.json(meGusta);
    }
    catch (error) {
        console.error("Error en la API:", error);
        return res.status(500).json({ error: 'Error al buscar en la base de datos' });
    }
}

// Obtener si el usuario ya le dio me gusta a un elemento
exports.getMeGustaByUser = async (req, res) => {
    const { idUser, idElemento } = req.params;

    try {
        const meGusta = await meGustaController.getMeGustaByUser(idUser, idElemento);
        if (!meGusta) {
            return res.status(404).json(null);
        }
        return res.json(meGusta);
    } catch (error) {
        console.error("Error en la API:", error);
        return res.status(500).json({ error: 'Error al buscar en la base de datos' });
    }
}

// Crear un nuevo me gusta
exports.createMeGusta = async (req, res) => {
    try {
        const meGusta = req.body;
        const insertId = await meGustaController.createMeGusta(meGusta);
        res.status(201).json({ message: 'Me gusta creado exitosamente.', id: insertId });
    } catch (error) {
        console.error("Error en createMeGusta:", error);
        res.status(500).json({ error: 'Error al crear el me gusta en la base de datos.' });
    }
}

// Eliminar un me gusta
exports.deleteMeGusta = async (req, res) => {
    const { idUser, idElemento } = req.params;
    try {
        const result = await meGustaController.deleteMeGusta(idUser, idElemento);
        if (result === 0) {
            return res.status(404).json({ error: 'Me gusta no encontrado' });
        }
        return res.json({ message: 'Me gusta eliminado exitosamente.' });
    } catch (error) {
        console.error("Error en deleteMeGusta:", error);
        res.status(500).json({ error: 'Error al eliminar el me gusta en la base de datos.' });
    }
}