const express = require('express');
const puppeteer = require('puppeteer');

const router = express.Router();

router.get('/driver-data', async (req, res) => {
  const { url } = req.query;
  
  if (!url) {
    return res.status(400).json({ error: 'URL parameter is required' });
  }
  
  try {
    const data = await getDriverData(url);
    res.json(data);
  } catch (error) {
    console.error('Error scraping driver data:', error);
    res.status(500).json({ error: 'Failed to fetch driver data' });
  }
});

async function getDriverData(url) {
  const browser = await puppeteer.launch({ 
    headless: "new" // Updated syntax for newer Puppeteer
  });
  const page = await browser.newPage();

  try {
    await page.goto(url, { waitUntil: 'domcontentloaded' });

    // Extraer datos del piloto
    const data = await page.evaluate(() => {
      const getTableData = (headerText) => {
        const rows = Array.from(document.querySelectorAll('.infobox tr'));
        const sectionHeaderIndex = rows.findIndex(r => r.querySelector('th') && r.querySelector('th').textContent.includes('Formula One World Championship career'));
        if (sectionHeaderIndex === -1) return null;

        const sectionRows = rows.slice(sectionHeaderIndex + 1);
        const row = sectionRows.find(r => r.querySelector('th') && r.querySelector('th').textContent.includes(headerText));
        return row ? row.querySelector('td') : null;
      };

      const getVida = (headerText) => {
        const rows = Array.from(document.querySelectorAll('.infobox tr'));
        const row = rows.find(r => r.querySelector('th') && r.querySelector('th').textContent.includes(headerText));
        return row ? row.querySelector('td') : null;
      };

      const bornCell = getVida('Born');
      let birthDate = null;
      let birthPlace = null;

      if (bornCell) {
        // Extraer fecha de nacimiento
        const dateNode = Array.from(bornCell.childNodes).find(node => 
          node.nodeType === Node.TEXT_NODE && 
          node.nodeValue.trim().match(/\d{1,2} \w+ \d{4}/)
        );
        birthDate = dateNode?.nodeValue.trim() || null;

        // Extraer lugar de nacimiento
        birthPlace = bornCell.querySelector('.birthplace')?.textContent.replace(/\[.*?\]/g, '').trim() || null;
      }

      const deathCell = getVida('Died');
      let deathDate = null;
      let deathPlace = null;

      if (deathCell) {
        // Extraer fecha de fallecimiento
        const dateNode = Array.from(deathCell.childNodes).find(node => 
          node.nodeType === Node.TEXT_NODE && 
          node.nodeValue.trim().match(/\d{1,2} \w+ \d{4}/)
        );
        deathDate = dateNode?.nodeValue.trim() || null;

        // Extraer lugar de fallecimiento
        deathPlace = deathCell.querySelector('.deathplace')?.textContent.replace(/\[.*?\]/g, '').trim() || null;
      } else {
        deathDate = 'Vivo';
        deathPlace = 'Vivo';
      }

      const firstWinCell = getTableData('First win');
      let firstWin = null;
      if (firstWinCell) {
        firstWin = firstWinCell.textContent.replace(/\[.*?\]/g, '').trim();
      } else {
        firstWin = 'No ha ganado';
      }

      const racesFinishedCell = getTableData('Entries');
      let racesFinished = null;
      if (racesFinishedCell) {
        // Extraer carreras terminadas
        const racesFinishedText = racesFinishedCell.textContent.replace(/\[.*?\]/g, '').trim();
        const match = racesFinishedText.match(/^(\d+)/);
        racesFinished = match ? match[1] : racesFinishedText;
      }

      return {
        birthDate, // Fecha de nacimiento
        birthPlace, // Lugar de nacimiento
        deathPlace, // Lugar de fallecimiento (si aplica)
        deathDate, // Fecha de fallecimiento (si aplica)
        firstRace: getTableData('First entry')?.textContent.replace(/\[.*?\]/g, '').trim() || null, // Carrera de debut
        lastRace: getTableData('Last entry')?.textContent.replace(/\[.*?\]/g, '').trim() || null, // Carrera de retiro
        firstWin, // Primera victoria
        championships: getTableData('Championships')?.textContent.replace(/\[.*?\]/g, '').trim() || null, // Mundiales ganados
        wins: getTableData('Wins')?.textContent.replace(/\[.*?\]/g, '').trim() || null, // Victorias
        poles: getTableData('Pole positions')?.textContent.replace(/\[.*?\]/g, '').trim() || null, // Poles
        fastestLaps: getTableData('Fastest laps')?.textContent.replace(/\[.*?\]/g, '').trim() || null, // Vueltas rápidas
        podiums: getTableData('Podiums')?.textContent.replace(/\[.*?\]/g, '').trim() || null, // Podios
        points: getTableData('Career points')?.textContent.replace(/\[.*?\]/g, '').trim() || null, // Puntos totales
        racesFinished, // Carreras terminadas
      };
    });

    return data;
  } finally {
    await browser.close();
  }
}

module.exports = router;