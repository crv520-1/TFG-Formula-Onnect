const express = require('express');
const puppeteer = require('puppeteer');

const router = express.Router();

router.get('/equipo-data', async (req, res) => {
  const { url } = req.query;
  
  if (!url) {
    return res.status(400).json({ error: 'URL parameter is required' });
  }
  
  try {
    const data = await getEquipoData(url);
    res.json(data);
  } catch (error) {
    console.error('Error scraping equipo data:', error);
    res.status(500).json({ error: 'Failed to fetch equipo data' });
  }
});

async function getEquipoData(url) {
  const browser = await puppeteer.launch({ 
    headless: "new" // Updated syntax for newer Puppeteer
  });
  const page = await browser.newPage();

  try {
    await page.goto(url, { waitUntil: 'domcontentloaded' });

    // Extraer datos del equipo
    const data = await page.evaluate(() => {
      const getTableData = (headerText) => {
        const rows = Array.from(document.querySelectorAll('.infobox tr'));
        const sectionHeaderIndex = rows.findIndex(r => r.querySelector('th') && r.querySelector('th').textContent.includes('Formula One World Championship career'));
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

      const racesFinishedCell = getTableData('Races entered');
      let racesFinished = null;
      if (racesFinishedCell) {
        // Extraer carreras terminadas
        const racesFinishedText = racesFinishedCell.textContent.replace(/\[.*?\]/g, '').trim();
        const match = racesFinishedText.match(/^(\d+)/);
        racesFinished = match ? match[1] : racesFinishedText;
      }

      const winsCell = getTableData('Race victories');
      let wins = null;
      if (winsCell) {
        // Extraer victorias
        const winsText = winsCell.textContent.replace(/\[.*?\]/g, '').trim();
        const match = winsText.match(/^(\d+)/);
        wins = match ? match[1] : winsText;
      } else {
        wins = "Sin datos encontrados"
      }

      const polesCell = getTableData('Pole positions');
      let poles = null;
      if (polesCell) {
        // Extraer poles
        const polesText = polesCell.textContent.replace(/\[.*?\]/g, '').trim();
        const match = polesText.match(/^(\d+)/);
        poles = match ? match[1] : polesText;
      } else {
        poles = "Sin datos encontrados"
      }

      const foundersCell = getHistoria('Founder(s)');
      let founders = "Desconocidos";
      if (foundersCell) {
        founders = Array.from(foundersCell.querySelectorAll('a')) // Obtiene todos los enlaces (nombres de personas)
          .map(a => a.textContent.replace(/\[.*?\]/g, '').trim()) // Extrae el texto sin espacios extra
          .join(', '); // Une los nombres separados por comas
      } else {
        founders = "Desconocidos";
      }

      const pointsCell = getTableData('Points');
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
        firstRace: getTableData('First entry')?.textContent.replace(/\[.*?\]/g, '').trim() || null, // Carrera de debut
        lastRace: getTableData('Last entry')?.textContent.replace(/\[.*?\]/g, '').trim() || getTableData('Final entry')?.textContent.replace(/\[.*?\]/g, '').trim() || "Desconocida", // Carrera de retiro
        constructorChampionships: getTableData('Constructors Championships')?.textContent.replace(/\[.*?\]/g, '').trim() || null, // Mundiales de constructores ganados
        driverChampionships: getTableData('Drivers Championships')?.textContent.replace(/\[.*?\]/g, '').trim() || null, // Mundiales de pilotos ganados
        wins, // Victorias
        poles, // Poles
        fastestLaps: getTableData('Fastest laps')?.textContent.replace(/\[.*?\]/g, '').trim() || null, // Vueltas rápidas
        podiums: getTableData('Podiums')?.textContent.replace(/\[.*?\]/g, '').trim() || "Sin datos encontrados", // Podios
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