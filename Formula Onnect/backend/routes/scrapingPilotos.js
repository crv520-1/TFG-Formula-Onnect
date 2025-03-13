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
        const row = rows.find(r => r.querySelector('th') && r.querySelector('th').textContent.includes(headerText));
        return row ? row.querySelector('td') : null;
      };

      const bornCell = getTableData('Born');
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
        birthPlace = bornCell.querySelector('.birthplace')?.textContent.trim() || null;
      }

      return {
        birthDate, // Fecha de nacimiento
        birthPlace, // Lugar de nacimiento
        deathPlace: getTableData('Died')?.textContent.trim() || null, // Lugar de fallecimiento (si aplica)
        deathDate: getTableData('Died')?.textContent.trim() || null, // Fecha de fallecimiento (si aplica)
        debutYear: getTableData('Formula One World Championship debut')?.textContent.trim() || null, // Año de debut
        championships: getTableData('Championships')?.textContent.trim() || null, // Mundiales ganados
        wins: getTableData('Wins')?.textContent.trim() || null, // Victorias
        poles: getTableData('Pole positions')?.textContent.trim() || null, // Poles
        fastestLaps: getTableData('Fastest laps')?.textContent.trim() || null, // Vueltas rápidas
        podiums: getTableData('Podiums')?.textContent.trim() || null, // Podios
        points: getTableData('Career points')?.textContent.trim() || null, // Puntos totales
        racesFinished: getTableData('Entries')?.textContent.trim() || null, // Grandes Premios terminados
      };
    });

    return data;
  } finally {
    await browser.close();
  }
}

module.exports = router;