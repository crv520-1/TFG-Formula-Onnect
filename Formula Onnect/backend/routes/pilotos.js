const express = require('express');
const router = express.Router();
const db = require('../controllers/pilotosController');

router.get('/', db.getAllPilotos); // Buscar todos los pilotos
router.get('/:id', db.getPilotosByIdPiloto); // Buscar un piloto por ID
router.get('/driverId/:driverId', db.getPilotosByDriverId); // Buscar un piloto por driverId
router.post('/', db.postPilotos); // Crear un nuevo piloto

module.exports = router;