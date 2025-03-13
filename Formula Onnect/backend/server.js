const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');

// Cargar variables de entorno
dotenv.config();

// Inicializar Express
const app = express();
const PORT = 3000;

// Middlewares
app.use(cors());
app.use(bodyParser.json());

// Rutas
const pilotosRoutes = require('./routes/pilotos');
const equiposRoutes = require('./routes/equipos');
const circuitosRoutes = require('./routes/circuitos');
const comentariosRoutes = require('./routes/comentarios');
const usuariosRoutes = require('./routes/usuario');
const meGustaRoutes = require('./routes/meGusta');
const prediccionesRoutes = require('./routes/predicciones');
const publicacionesRoutes = require('./routes/publicaciones');
const seguidoresRoutes = require('./routes/seguidores');
const scrapingPilotosRoutes = require('./routes/scrapingPilotos');

app.use('/api/pilotos', pilotosRoutes);
app.use('/api/equipos', equiposRoutes);
app.use('/api/circuitos', circuitosRoutes);
app.use('/api/comentarios', comentariosRoutes);
app.use('/api/usuarios', usuariosRoutes);
app.use('/api/meGusta', meGustaRoutes);
app.use('/api/predicciones', prediccionesRoutes);
app.use('/api/publicaciones', publicacionesRoutes);
app.use('/api/seguidores', seguidoresRoutes);
app.use('/api/scrapingPilotos', scrapingPilotosRoutes);

// Iniciar servidor
app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));
