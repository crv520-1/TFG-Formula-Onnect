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