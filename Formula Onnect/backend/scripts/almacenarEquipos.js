const axios = require('axios');
const db = require('./models/equiposModel');
const dotenv = require('dotenv');
const { getPaisISO, getTraduccionPais } = require('./mapeoPaises');

dotenv.config();

async function esperar(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function buscarYAlmacenarEquipos() {
    let equiposSet = new Set();
    let allEquipos = [];

    try {
        for (let year = 2000; year <= 2025; year++) {
            try {
                let response = await axios.get(`https://api.jolpi.ca/ergast/f1/${year}/constructors/`);
                let equipos = response.data.MRData.ConstructorTable.Constructors;

                equipos.forEach(equipo => {
                    if (!equiposSet.has(equipo.constructorId)) {
                        equiposSet.add(equipo.constructorId);
                        allEquipos.push({
                            constructorId: equipo.constructorId,
                            nombreEquipo: equipo.name,
                            nacionalidadEquipo: getTraduccionPais(equipo.nationality),
                            urlEquipo: equipo.url,
                            isoNacEqui: getPaisISO(equipo.nationality)
                        });
                    }
                });

                for (const equipo of allEquipos) {
                    if (equipo.constructorId && equipo.nombreEquipo) {
                        const exists = await db.equipoExiste(equipo.constructorId);
                        if (!exists) {
                            try {
                                await db.postEquipos(equipo);
                            } catch (error) {
                                console.error(`Error al almacenar el equipo ${equipo.constructorId}:`, error);
                            }
                        }
                    }
                }

                console.log(`Datos de los equipos de la temporada ${year} almacenados correctamente.`);
                
                // Esperar antes de la próxima solicitud para evitar la limitación
                await esperar(500); // Espera 500ms antes de hacer la siguiente petición

            } catch (error) {
                console.error(`Error en el año ${year}:`, error);
            }
        }
    } catch (error) {
        console.error('Error al obtener o almacenar equipos:', error);
    }
}

buscarYAlmacenarEquipos();
