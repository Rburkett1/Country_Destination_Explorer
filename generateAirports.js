// generateAirports.js
// Requires: npm install csv-parser
// Place worldcities.csv and airports.csv in the same directory as this script.
// Download worldcities.csv from https://simplemaps.com/data/world-cities
// Download airports.csv from https://ourairports.com/data/

const fs = require('fs');
const csv = require('csv-parser');

const CITIES_CSV = 'worldcities.csv';
const AIRPORTS_CSV = 'airports.csv';
const OUTPUT_JSON = 'airports.json';

function getTopCitiesByCountry(n = 3) {
  return new Promise((resolve) => {
    const countryCities = {};
    fs.createReadStream(CITIES_CSV)
      .pipe(csv())
      .on('data', (row) => {
        const country = row.country;
        const city = row.city;
        const pop = parseInt(row.population, 10) || 0;
        if (!country || !city || !pop) return;
        if (!countryCities[country]) countryCities[country] = [];
        countryCities[country].push({ city, pop });
      })
      .on('end', () => {
        // Sort and keep top n
        Object.keys(countryCities).forEach((country) => {
          countryCities[country].sort((a, b) => b.pop - a.pop);
          countryCities[country] = countryCities[country].slice(0, n).map(c => c.city);
        });
        resolve(countryCities);
      });
  });
}

function loadAirports() {
  return new Promise((resolve) => {
    const airports = [];
    fs.createReadStream(AIRPORTS_CSV)
      .pipe(csv())
      .on('data', (row) => {
        if (!['large_airport', 'medium_airport'].includes(row.type)) return;
        airports.push({
          city: row.municipality,
          country: row.iso_country, // ISO code, not name
          airport_name: row.name,
          iata_code: row.iata_code,
          icao_code: row.ident,
          lat: parseFloat(row.latitude_deg),
          lon: parseFloat(row.longitude_deg)
        });
      })
      .on('end', () => resolve(airports));
  });
}

async function buildAirportJson() {
  const citiesByCountry = await getTopCitiesByCountry();
  const airports = await loadAirports();
  // Optionally, map ISO country code to country name if needed
  // For now, match by city name only
  const result = {};
  for (const [country, cities] of Object.entries(citiesByCountry)) {
    result[country] = [];
    for (const city of cities) {
      // Find airport for this city
      const match = airports.find(a => a.city && a.city.toLowerCase() === city.toLowerCase());
      if (match) result[country].push(match);
    }
  }
  return result;
}

buildAirportJson().then((airportData) => {
  fs.writeFileSync(OUTPUT_JSON, JSON.stringify(airportData, null, 2), 'utf-8');
  console.log('Done! airports.json created.');
});
