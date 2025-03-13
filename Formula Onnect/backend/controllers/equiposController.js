const equiposController = require('../models/equiposModel.js');

// Obtener todos los equipos
exports.getAllEquipos = async (req, res) => {
  try {
    const equipos = await equiposController.getAllEquipos();
    res.json(equipos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener un equipo por su id
exports.getEquiposByIdEquipo = (req, res) => {
    const idEquipos = req.params.id;

    equiposController.getEquiposByIdEquipo(idEquipos, (err, results) => {
        if (err) {
            return res.status(500).json({error: 'Error al buscar en la base de datos'});
        }
        if (results.length === 0) {
            return res.status(404).json({error: 'Equipo no encontrado'});
        }
        res.json(results);
    });
}

// Almacenar un nuevo equipo
exports.postEquipos = (req, res) => {
    const equipo = req.body;

    equiposController.postEquipos(equipo, (err, results) => {
        if (err) {
            return res.status(500).json({error: 'Error al crear en la base de datos'});
        }
        res.status(201).json({ message: 'Equipo creado exitosamente.', id: results.insertId });
    });
};