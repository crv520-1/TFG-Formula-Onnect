const express = require('express');
const router = express.Router();
const db = require('../controllers/meGustaController');

router.get('/', db.getAllMeGusta); // Buscar todos los me gusta
router.get('/elemento/:idElemento', db.getAllMeGustaById); // Buscar todos los me gusta por idElemento
router.get('/:idElemento', db.getMeGustaById); // Buscar los me gusta por idElemento
router.get('/user/:idUser/:idElemento', db.getMeGustaByUser); // Buscar si el usuario ya le dio me gusta a un elemento
router.post('/', db.createMeGusta); // Crear un nuevo me gusta
router.delete('/:idUser/:idElemento', db.deleteMeGusta); // Eliminar un me gusta

module.exports = router;