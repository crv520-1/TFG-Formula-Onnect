const express = require('express');
const router = express.Router();
const db = require('../controllers/seguidoresController');

router.get('/seguidores/:id', db.countSeguidores); // Contador de mis seguidores
router.get('/siguiendo/:id', db.countSiguiendo); // Contador de a quien sigo
router.get('/', db.getAllSeguidores); // Buscar a todos los seguidores
router.get('/:id', db.getAllSigo); // Buscar a quien sigo
router.get('/:nickName', db.getAllMeSiguen); // Buscar quien me sigue
router.get('/:idSeguidor/:idSeguido', db.getSeguimiento); // Buscar si sigo a un usuario
router.post('/', db.createSeguimiento); // Crear un nuevo seguimiento
router.delete('/:idSeguidor/:idSeguido', db.deleteSeguimiento); // Dejar de seguir a un usuario

module.exports = router;
