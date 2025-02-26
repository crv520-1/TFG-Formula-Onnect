const axios = require('axios');
const db = require('./models/pilotosModel');
const dotenv = require('dotenv');
const { getPaisISO, getTraduccionPais } = require('./mapeoPaises');

dotenv.config();

async function esperar(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function buscarYAlmacenarPilotos() {
    let pilotosSet = new Set();
    let allPilotos = [];

    try {
        for (let year = 2000; year <= 2025; year++) {
            let response = await axios.get(`https://api.jolpi.ca/ergast/f1/${year}/drivers/`);
            let pilotos = response.data.MRData.DriverTable.Drivers;

            pilotos.forEach(piloto => {
                if (!pilotosSet.has(piloto.driverId)) {
                    pilotosSet.add(piloto.driverId);
                    allPilotos.push({
                        driverId: piloto.driverId,
                        nombrePiloto: piloto.givenName,
                        apellidoPiloto: piloto.familyName,
                        nacionalidadPiloto: getTraduccionPais(piloto.nationality),
                        urlPiloto: piloto.url,
                        isoNacPil: getPaisISO(piloto.nationality)
                    });
                }
            });

            // Almacenar pilotos en la base de datos
            for (const piloto of allPilotos) {
                if (piloto.driverId && piloto.nombrePiloto && piloto.apellidoPiloto) {
                    const exists = await db.pilotoExiste(piloto.driverId);
                    if (!exists) {
                        try {
                            await db.postPilotos(piloto);
                        } catch (error) {
                            console.error(`Error al almacenar el piloto ${piloto.driverId}:`, error);
                        }
                    }
                }
            }

            console.log(`Datos de los pilotos de la temporada ${year} almacenados correctamente.`);

            // Esperar antes de la próxima solicitud para evitar la limitación
            await esperar(500); // Espera 500ms antes de hacer la siguiente petición
        }
    } catch (error) {
        console.error('Error al obtener o almacenar pilotos:', error);
    }
}

buscarYAlmacenarPilotos();
