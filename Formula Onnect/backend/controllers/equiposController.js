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
exports.getEquiposByIdEquipo = async (req, res) => {
    const idEquipos = req.params.id;
    try {
        const equipo = await equiposController.getEquiposByIdEquipo(idEquipos);
        res.json(equipo);
    } catch (error) {
        res.status(404).json({ error: 'Equipo no encontrado' });
    }
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