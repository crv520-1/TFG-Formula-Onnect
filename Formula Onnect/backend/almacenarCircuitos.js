const axios = require('axios');
const db = require('./models/circuitosModel');
const dotenv = require('dotenv');
const { getPaisISO, getTraduccionPais } = require('./scripts/mapeoPaises');

dotenv.config();

async function esperar(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function buscarYAlmacenarCircuitos() {
    let circuitosSet = new Set();
    let allCircuitos = [];

    try {
        for (let year = 2000; year <= 2025; year++) {
            let response = await axios.get(`https://api.jolpi.ca/ergast/f1/${year}/circuits/`);
            let circuitos = response.data.MRData.CircuitTable.Circuits;

            circuitos.forEach(circuito => {
                if (!circuitosSet.has(circuito.circuitId)) {
                    circuitosSet.add(circuito.circuitId);
                    allCircuitos.push({
                        circuitId: circuito.circuitId,
                        nombreCircuito: circuito.circuitName,
                        urlCircuito: circuito.url,
                        pais: getTraduccionPais(circuito.Location.country),
                        isoPais: getPaisISO(circuito.Location.country),
                        ciudad: circuito.Location.locality
                    });
                }
            });

            // Almacenar circuitos en la base de datos
            for (const circuito of allCircuitos) {
                if (circuito.circuitId && circuito.nombreCircuito) {
                    const exists = await db.circuitoExiste(circuito.circuitId);
                    if (!exists) {
                        try {
                            await db.postCircuitos(circuito);
                        } catch (error) {
                            console.error(`Error al almacenar el circuito ${circuito.circuitId}:`, error);
                        }
                    }
                }
            }

            console.log(`Datos de los circuitos de la temporada ${year} almacenados correctamente.`);

            // Esperar antes de la próxima solicitud para evitar la limitación
            await esperar(500); // Espera 500ms antes de hacer la siguiente petición
        }
    } catch (error) {
        console.error('Error al obtener o almacenar circuitos:', error);
    }
}

buscarYAlmacenarCircuitos();
