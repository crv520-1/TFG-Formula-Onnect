const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Configurar dónde se guardan las imágenes
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = "./public/images/fotoPerfil";
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const fileName = req.body.nickName + ext;
        cb(null, fileName);
    }
});

const upload = multer({ storage }).single("image");

const subirImagen = (req, res) => {
    upload(req, res, (err) => {
        if (err) {
            return res.status(500).json({ success: false, message: "Error al subir la imagen", error: err });
        }
        if (!req.file) {
            return res.status(400).json({ success: false, message: "No se subió ninguna imagen" });
        }
        res.json({ success: true, message: "Imagen subida correctamente", fileName: req.file.filename });
    });
};

module.exports = { subirImagen };
