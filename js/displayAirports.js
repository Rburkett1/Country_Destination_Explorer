// displayAirports.js
// Usage: Include this script in your HTML and call displayAirportsForCountry('France') or any country name.
// Assumes airports.json is in the same directory and follows the structure: { country: [ { city, airport_name, iata_code, icao_code, lat, lon } ] }

async function fetchAirportsData() {
    const res = await fetch('airports.json');
    if (!res.ok) throw new Error('Could not load airports.json');
    return res.json();
}

function buildAirportsList(airportArray) {
    if (!airportArray || !Array.isArray(airportArray) || airportArray.length === 0) {
        return '<p>No airport data available.</p>';
    }
    return `<ul>` +
        airportArray.map(airport => `
            <li>
                <strong>${airport.city} – ${airport.airport_name}</strong><br>
                IATA: ${airport.iata_code || 'N/A'} | ICAO: ${airport.icao_code || 'N/A'}<br>
                Lat: ${airport.lat}, Lon: ${airport.lon}
            </li>
        `).join('') +
        `</ul>`;
}

async function displayAirportsForCountry(countryName, containerId = 'airports') {
    try {
        const airportsData = await fetchAirportsData();
        const airportArray = airportsData[countryName];
        const html = buildAirportsList(airportArray);
        const container = document.getElementById(containerId);
        if (container) {
            container.innerHTML = `<div class="airport-title">Airports</div>` + html;
        }
    } catch (error) {
        const container = document.getElementById(containerId);
        if (container) {
            container.innerHTML = '<div class="airport-title">Airports</div><p>Error loading airport data.</p>';
        }
        console.error(error);
    }
}

// Example usage:
// displayAirportsForCountry('France');
