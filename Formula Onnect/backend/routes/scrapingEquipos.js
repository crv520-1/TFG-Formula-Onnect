const express = require('express');
const puppeteer = require('puppeteer');

const router = express.Router();

router.get('/equipo-data', async (req, res) => {
  const { index, urlEng, urlEsp } = req.query;
  
  if (!urlEng || !urlEsp || !index) {
    return res.status(400).json({ error: 'Los parametros index y URL son necesarios' });
  }
  
  try {
    const data = await getEquipoData(index, urlEng, urlEsp);
    res.json(data);
  } catch (error) {
    console.error('Error scraping equipo data:', error);
    res.status(500).json({ error: 'Failed to fetch equipo data' });
  }
});

// Si no obtenemos un dato que se haga rellamada a si mismo para obtenerlo de la otra URL
// Probar primero con la URL de la Wikipedia de España para el tema de los puntos de Ferrari
// Probar en segunda y última ocasión con la URL de la Wikipedia en inglés
// Si no se obtiene el dato, devolver "Sin datos encontrados"
// Enviar un index para saber si ya ha probado con la versión inglesa y española
// Si el index es 0 es que va a probar con España y si es 1 ya ha probado con España y va a probar con la versión inglesa
// Si el index es 2 es que ya ha probado con ambas versiones y no ha encontrado el dato por lo que devolvemos "Sin datos encontrados"
async function getEquipoData(index, urlEng, urlEsp) {
  const browser = await puppeteer.launch({ 
    headless: "new" // Updated syntax for newer Puppeteer
  });
  const page = await browser.newPage();

  try {
    await page.goto(urlEsp, { waitUntil: 'domcontentloaded' });

    // Extraer datos del equipo
    const data = await page.evaluate(() => {
      const getTableData = (headerText) => {
        const rows = Array.from(document.querySelectorAll('.infobox tr'));
        // Poner tanto la versión española como la versión inglesa de la tabla
        const sectionHeaderIndex = rows.findIndex(r => r.querySelector('th') && (r.querySelector('th').textContent.includes('Fórmula 1') || r.querySelector('th').textContent.includes('F1')));
        if (sectionHeaderIndex === -1) return null;

        const sectionRows = rows.slice(sectionHeaderIndex + 1);
        const row = sectionRows.find(r => r.querySelector('th') && r.querySelector('th').textContent.includes(headerText));
        return row ? row.querySelector('td') : null;
      };

      const getHistoria = (headerText) => {
        const rows = Array.from(document.querySelectorAll('.infobox tr'));
        const row = rows.find(r => r.querySelector('th') && r.querySelector('th').textContent.includes(headerText));
        return row ? row.querySelector('td') : null;
      };

      const racesFinishedCell = getTableData('Carreras');
      let racesFinished = null;
      if (racesFinishedCell) {
        // Extraer carreras terminadas
        const racesFinishedText = racesFinishedCell.textContent.replace(/\[.*?\]/g, '').trim();
        const match = racesFinishedText.match(/^(\d+)/);
        racesFinished = match ? match[1] : racesFinishedText;
      }

      const winsCell = getTableData('Victorias');
      let wins = null;
      if (winsCell) {
        // Extraer victorias
        const winsText = winsCell.textContent.replace(/\[.*?\]/g, '').trim();
        const match = winsText.match(/^(\d+)/);
        wins = match ? match[1] : winsText;
      }

      const polesCell = getTableData('Pole positions');
      let poles = null;
      if (polesCell) {
        // Extraer poles
        const polesText = polesCell.textContent.replace(/\[.*?\]/g, '').trim();
        const match = polesText.match(/^(\d+)/);
        poles = match ? match[1] : polesText;
      }

      const foundersCell = getHistoria('Fundador/es');
      let founders = null;
      if (foundersCell) {
        founders = foundersCell.textContent.replace(/\[.*?\]/g, '').trim()
      } else {
        founders = "Desconocido";
      }

      const pointsCell = getTableData('Puntos');
      let points = null;
      if (pointsCell) {
        // Extraer puntos
        const pointsText = pointsCell.textContent.replace(/\[.*?\]/g, '').trim();
        const match = pointsText.match(/^(\d+)/);
        points = match ? match[1] : pointsText;
      } else {
        points = "Sin datos encontrados";
      }

      return {
        founders, // Fundadores
        firstRace: getTableData('Debut')?.textContent.replace(/\[.*?\]/g, '').trim() || null, // Carrera de debut
        lastRace: getTableData('Última carrera')?.textContent.replace(/\[.*?\]/g, '').trim() || "Desconocida", // Carrera de retiro
        constructorChampionships: getTableData('Campeonatos de Constructores')?.textContent.replace(/\[.*?\]/g, '').trim() || getTableData('Campeonatos de Escuderías')?.textContent.replace(/\[.*?\]/g, '').trim() || "No hay datos", // Mundiales de constructores ganados
        driverChampionships: getTableData('Campeonatos de Pilotos')?.textContent.replace(/\[.*?\]/g, '').trim() || null, // Mundiales de pilotos ganados
        wins, // Victorias
        poles, // Poles
        fastestLaps: getTableData('Vueltas rápidas')?.textContent.replace(/\[.*?\]/g, '').trim() || null, // Vueltas rápidas
        podiums: getTableData('Podios')?.textContent.replace(/\[.*?\]/g, '').trim() || "Sin datos encontrados", // Podios
        points, // Puntos totales
        racesFinished, // Carreras terminadas
      };
    });

    return data;
  } finally {
    await browser.close();
  }
}

module.exports = router;