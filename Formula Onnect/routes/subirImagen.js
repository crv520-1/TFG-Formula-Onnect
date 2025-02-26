const express = require("express");
const router = express.Router();
const db = require("../controllers/subirImagenController");

router.post("/subirImagen", db.subirImagen);

module.exports = router;
