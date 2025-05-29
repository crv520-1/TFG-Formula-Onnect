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
    // Use Spanish URL first (index 0), then English URL (index 1)
    const url = index == 0 ? urlEsp : urlEng;
    const isEnglish = index == 1;
    
    await page.goto(url, { waitUntil: 'domcontentloaded' });

    // Extraer datos del equipo
    const data = await page.evaluate((isEnglish) => {
      // Define headers in both languages
      const headers = {
        formula1Section: isEnglish ? ['Formula One', 'F1'] : ['Fórmula 1', 'F1'],
        races: isEnglish ? ['Entries', 'Races'] : ['Carreras'],
        wins: isEnglish ? ['Race victories', 'Wins'] : ['Victorias'],
        poles: isEnglish ? ['Pole positions'] : ['Pole positions'],
        founders: isEnglish ? ['Founder', 'Founded by'] : ['Fundador/es'],
        points: isEnglish ? ['Points'] : ['Puntos'],
        debut: isEnglish ? ['First entry', 'First race'] : ['Debut'],
        lastRace: isEnglish ? ['Last entry', 'Last race'] : ['Última carrera'],
        constructorChampionships: isEnglish ? ["Constructors' Championships", "Constructors' titles"] : ['Campeonatos de Constructores', 'Campeonatos de Escuderías'],
        driverChampionships: isEnglish ? ["Drivers' Championships"] : ['Campeonatos de Pilotos'],
        fastestLaps: isEnglish ? ['Fastest laps'] : ['Vueltas rápidas'],
        podiums: isEnglish ? ['Podiums'] : ['Podios']
      };

      const getTableData = (headerTexts) => {
        const rows = Array.from(document.querySelectorAll('.infobox tr'));
        // Look for Formula 1 or F1 section
        const sectionHeaderIndex = rows.findIndex(r => {
          const th = r.querySelector('th');
          return th && headers.formula1Section.some(text => th.textContent.includes(text));
        });
        
        if (sectionHeaderIndex === -1) return null;

        const sectionRows = rows.slice(sectionHeaderIndex + 1);
        
        // Find row that matches any of the provided header texts
        const row = sectionRows.find(r => {
          const th = r.querySelector('th');
          return th && headerTexts.some(text => th.textContent.includes(text));
        });
        
        return row ? row.querySelector('td') : null;
      };

      const getHistoria = (headerTexts) => {
        const rows = Array.from(document.querySelectorAll('.infobox tr'));
        const row = rows.find(r => {
          const th = r.querySelector('th');
          return th && headerTexts.some(text => th.textContent.includes(text));
        });
        return row ? row.querySelector('td') : null;
      };

      // Extract data using the language-specific headers
      const racesFinishedCell = getTableData(headers.races);
      let racesFinished = null;
      if (racesFinishedCell) {
        const racesFinishedText = racesFinishedCell.textContent.replace(/\[.*?\]/g, '').trim();
        const match = racesFinishedText.match(/^(\d+)/);
        racesFinished = match ? match[1] : racesFinishedText;
      }

      const winsCell = getTableData(headers.wins);
      let wins = null;
      if (winsCell) {
        const winsText = winsCell.textContent.replace(/\[.*?\]/g, '').trim();
        const match = winsText.match(/^(\d+)/);
        wins = match ? match[1] : winsText;
      }

      const polesCell = getTableData(headers.poles);
      let poles = null;
      if (polesCell) {
        const polesText = polesCell.textContent.replace(/\[.*?\]/g, '').trim();
        const match = polesText.match(/^(\d+)/);
        poles = match ? match[1] : polesText;
      }

      const foundersCell = getHistoria(headers.founders);
      let founders = null;
      if (foundersCell) {
        founders = foundersCell.textContent.replace(/\[.*?\]/g, '').trim();
      } else {
        founders = "Desconocido";
      }

      const pointsCell = getTableData(headers.points);
      let points = null;
      if (pointsCell) {
        const pointsText = pointsCell.textContent.replace(/\[.*?\]/g, '').trim();
        const match = pointsText.match(/^(\d+)/);
        points = match ? match[1] : pointsText;
      } else {
        points = "Sin datos encontrados";
      }

      return {
        founders,
        firstRace: getTableData(headers.debut)?.textContent.replace(/\[.*?\]/g, '').trim() || null,
        lastRace: getTableData(headers.lastRace)?.textContent.replace(/\[.*?\]/g, '').trim() || "Desconocida",
        constructorChampionships: getTableData(headers.constructorChampionships)?.textContent.replace(/\[.*?\]/g, '').trim() || "No hay datos",
        driverChampionships: getTableData(headers.driverChampionships)?.textContent.replace(/\[.*?\]/g, '').trim() || null,
        wins,
        poles,
        fastestLaps: getTableData(headers.fastestLaps)?.textContent.replace(/\[.*?\]/g, '').trim() || null,
        podiums: getTableData(headers.podiums)?.textContent.replace(/\[.*?\]/g, '').trim() || "Sin datos encontrados",
        points,
        racesFinished,
      };
    }, isEnglish);

    return data;
  } finally {
    await browser.close();
  }
}

module.exports = router;