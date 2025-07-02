// --- Helper Functions ---

async function fetchCountryData(country) {
    const res = await fetch(`https://restcountries.com/v3.1/name/${country}`);
    if (!res.ok) throw new Error('Network response was not ok');
    const data = await res.json();
    return data[0];
}


async function fetchLocalData() {
    const res = await fetch('countryfacts.json');
    return res.json();
}

function buildList(data, itemBuilder, emptyMsg) {
    if (!data) return emptyMsg;
    return `<ul>` +
        Object.entries(data)
            .map(itemBuilder)
            .join('') +
        `</ul>`;
}

function buildAirportsList(airportData) {
    return buildList(
        airportData,
        ([name, info]) => `
            <li>
                <div class="airport-name">${name}</div>
                <ul class="airport-info">
                    <li class="airport-code">Code: ${info.code}</li>
                    <li class="airport-location">Location: ${info.location}</li>
                </ul>
            </li>
        `,
        'No airport available.'
    );
}

function buildAttractionsList(attractionsData) {
    return buildList(
        attractionsData,
        ([name, info]) => `
            <li>
                <strong>${name}</strong> (${info.location})<br>
                <em>${info.description}</em>
            </li>
        `,
        'No attractions available.'
    );
}

function buildFoodList(foodData) {
    return buildList(
        foodData,
        ([name, info]) => `
            <li>
                <strong>${name}</strong>
                <em>${info.description}</em>
            </li>
        `,
        'No food information available.'
    );
}

function buildCulturalEventsList(culturalEventsData) {
    return buildList(
        culturalEventsData,
        ([name, info]) => `
            <li>
                <strong>${name}</strong> (${info.date})<br>
                <em>${info.description}</em>
            </li>
        `,
        'No cultural events available.'
    );
}

function getGlobeIcon(region) {
    switch (region) {
        case 'Europe': return '<i class="fa-solid fa-earth-europe"></i>';
        case 'Asia': return '<i class="fa-solid fa-earth-asia"></i>';
        case 'Americas': return '<i class="fa-solid fa-earth-americas"></i>';
        case 'Oceania': return '<i class="fa-solid fa-earth-oceania"></i>';
        case 'Africa': return '<i class="fa-solid fa-earth-africa"></i>';
        default: return '<i class="fa-solid fa-globe"></i>';
    }
}

const currencyIcons = {
    france: '<i class="fa-solid fa-euro"></i>',
    spain: '<i class="fa-solid fa-euro"></i>',
    italy: '<i class="fa-solid fa-euro"></i>',
    japan: '<i class="fa-solid fa-yen-sign"></i>',
    brazil: '<i class="fa-solid fa-brazilian-real-sign"></i>',
    canada: '<i class="fa-solid fa-dollar-sign"></i>',
    australia: '<i class="fa-solid fa-dollar-sign"></i>',
    india: '<i class="fa-solid fa-rupee-sign"></i>',
};

const weatherCodeDescriptions = {
    0: "Clear sky", 1: "Mainly clear", 2: "Partly cloudy", 3: "Overcast",
    45: "Fog", 48: "Depositing rime fog", 51: "Light drizzle", 53: "Moderate drizzle",
    55: "Dense drizzle", 56: "Light freezing drizzle", 57: "Dense freezing drizzle",
    61: "Slight rain", 63: "Moderate rain", 65: "Heavy rain", 66: "Light freezing rain",
    67: "Heavy freezing rain", 71: "Slight snow fall", 73: "Moderate snow fall",
    75: "Heavy snow fall", 77: "Snow grains", 80: "Slight rain showers",
    81: "Moderate rain showers", 82: "Violent rain showers", 85: "Slight snow showers",
    86: "Heavy snow showers", 95: "Thunderstorm", 96: "Thunderstorm with slight hail",
    99: "Thunderstorm with heavy hail"
};

const weatherCodeIcons = {
    0: '<i class="fa-solid fa-sun"></i>',
    1: '<i class="fa-regular fa-sun"></i>',
    2: '<i class="fa-solid fa-cloud-sun"></i>',
    3: '<i class="fa-solid fa-cloud"></i>',
    45: '<i class="fa-solid fa-smog"></i>',
    48: '<i class="fa-solid fa-smog"></i>',
    51: '<i class="fa-solid fa-cloud-rain"></i>',
    53: '<i class="fa-solid fa-cloud-rain"></i>',
    55: '<i class="fa-solid fa-cloud-showers-heavy"></i>',
    56: '<i class="fa-solid fa-cloud-meatball"></i>',
    57: '<i class="fa-solid fa-cloud-meatball"></i>',
    61: '<i class="fa-solid fa-cloud-rain"></i>',
    63: '<i class="fa-solid fa-cloud-rain"></i>',
    65: '<i class="fa-solid fa-cloud-showers-heavy"></i>',
    66: '<i class="fa-solid fa-snowflake"></i>',
    67: '<i class="fa-solid fa-snowflake"></i>',
    71: '<i class="fa-regular fa-snowflake"></i>',
    73: '<i class="fa-solid fa-snowflake"></i>',
    75: '<i class="fa-solid fa-snowflake"></i>',
    77: '<i class="fa-solid fa-snowflake"></i>',
    80: '<i class="fa-solid fa-cloud-showers-heavy"></i>',
    81: '<i class="fa-solid fa-cloud-showers-heavy"></i>',
    82: '<i class="fa-solid fa-cloud-showers-heavy"></i>',
    85: '<i class="fa-solid fa-snowflake"></i>',
    86: '<i class="fa-solid fa-snowflake"></i>',
    95: '<i class="fa-solid fa-bolt"></i>',
    96: '<i class="fa-solid fa-cloud-bolt"></i>',
    99: '<i class="fa-solid fa-cloud-bolt"></i>'
};

const weatherCodeColors = {
    0: "#FFD600", 1: "#FFD600", 2: "#90A4AE", 3: "#90A4AE",
    45: "#90A4AE", 48: "#90A4AE", 51: "#2196F3", 53: "#2196F3",
    55: "#2196F3", 56: "#2196F3", 57: "#2196F3", 61: "#2196F3",
    63: "#2196F3", 65: "#2196F3", 66: "#2196F3", 67: "#2196F3",
    71: "#90A4AE", 73: "#90A4AE", 75: "#90A4AE", 77: "#90A4AE",
    80: "#2196F3", 81: "#2196F3", 82: "#2196F3", 85: "#90A4AE",
    86: "#90A4AE", 95: "#FFD600", 96: "#FFD600", 99: "#FFD600"
};

function buildCountryInfoHtml(countryData, localFact, history, airports, attractions, food, culturalEvents, apiFact) {
    return `
        <!-----/  Section 1  /----->
        <div class="country-info-container-1">   
            <div class="text-section">                      
                <div class="country">${countryData.name.common} ${countryData.coatOfArms?.svg
                    ? `<img src="${countryData.coatOfArms.svg}" alt="Coat of Arms of ${countryData.name.common}" class="coat-of-arms-img">`
                    : 'Not available'}</div>
                <div class="capital"><strong>Capital:</strong> ${countryData.capital?.[0] || 'N/A'}</div> 
             <!--   <div class="extra">Fact: ${localFact}</div>   -->         
            </div>
            <div class="flag-section">                                
                <img src="${countryData.flags.svg}" alt="Flag of ${countryData.name.common}">
            </div>                                                  
        </div>
        <div class="fact-container">
            <div class="extra"> ${apiFact}</div> 
        </div>
        
        <!-----/ Section 2  /----->
        <div class="country-info-container-2">                 
            <div class="info-box">
                <strong>Region</strong> 
                ${countryData.region}
                ${getGlobeIcon(countryData.region)}
            </div>
            <div class="info-box">
                <strong>Subregion</strong> 
                ${countryData.subregion}
                <i class="fa-solid fa-map-marker-alt"></i>
            </div>
            <div class="info-box">
                <strong>Area</strong> 
                ${countryData.area.toLocaleString()} km²
                <i class="fa-regular fa-compass"></i>
            </div>
            <div class="info-box">
                <strong>Currency</strong> 
                ${Object.values(countryData.currencies)[0].name} <br>
                ${currencyIcons[countryData.name.common.toLowerCase()] || ''}
            </div>
            <div class="info-box">
                <strong>Population</strong> 
                ${countryData.population.toLocaleString()}
                <i class="fa-solid fa-user"></i>
            </div>
        </div>
        <!-----/ Section 3  /----->
        <div class="country-info-container-3">    
            <div class="info-box-2"><strong>Languages</strong> ${Object.values(countryData.languages).join(', ')}</div>
            <div class="info-box-2"><strong>Timezone</strong> ${countryData.timezones?.[0] || 'N/A'}</div>
            <div class="info-box-2"><strong>Start of Week</strong> ${countryData.startOfWeek ? countryData.startOfWeek.charAt(0).toUpperCase() + countryData.startOfWeek.slice(1) : 'N/A'}</div>                        
            <div class="info-box-2"><strong>Borders</strong> ${countryData.borders?.join(', ') || 'None'}</div>
        </div>
        <!-----/ Section 4  /----->
        <div class="country-info-container-4">
            <div class="info-box-4 airport">
                <div class="airport-title">Airports</div> 
                ${airports}
            </div>
            <div class="info-box-4 map">
                <div class="googlemap-title">Map</div><br>
                <iframe   
                    class="google-map"                                                   
                    loading="lazy"
                    allowfullscreen
                    referrerpolicy="no-referrer-when-downgrade"
                    src="https://www.google.com/maps?q=${countryData.latlng[0]},${countryData.latlng[1]}&hl=en&z=5&output=embed">
                </iframe>
            </div>       
        </div>
        <!-----/ Weather Section /----->
        <div class="country-info-weather">
            <div class="info-box-6 weather">
                <div class = "weather-title">Today in ${countryData.capital?.[0] || 'NA'}, ${countryData.name.common}</div>
                <div class="weather-top">
                    <div id="weather-icon" class="weather-icon"></div>       
                    <div><span id="weather-temp"> Loading...</span> </div>
                </div>            
                <div class="weather-row"><span>Direction:</span> <span id="weather-winddir">...</span></div>
                <div class="weather-row"><span>Wind Speed:</span> <span id="weather-wind">...</span></div>
                <div class="weather-row"><span>Conditions:</span> <span id="weather-code">...</span></div>
                <div class="weather-row"><span>Humidity:</span> <span id="weather-humidity">...</span></div>
                <div class="weather-row"><span>Cloud Cover:</span> <span id="weather-cloud">...</span></div>                               
            </div>
            <div class="info-box-6 forecast">
                <span id="forecast-span"></span>
            </div>
        </div>
        <!-----/ Section 5  /----->
        <div class="country-info-container-5">    
            <div class="info-box-5"><strong>Attractions:</strong> ${attractions}</div>
            <div class="info-box-5"><strong>Food:</strong> ${food}</div>
            <div class="info-box-5"><strong>Cultural Events:</strong> ${culturalEvents}</div>
            <div class="info-box-5"><strong>Public Transit:</strong></div>  
            <div class="info-box-5" id = "airports"></div>
        </div>
    `;
}

function showError(message) {
    document.getElementById('info').innerHTML = `<p>${message}</p>`;
}

async function renderAirports(countryData) {
    const apiKey = '857e84fcc8e43fb6604ba22eb772c283';
    const airportBox = document.getElementById('airports');
    if (!airportBox) return;
    try {
        const res = await fetch(`https://api.aviationstack.com/v1/airports?access_key=${apiKey}&country_name=${encodeURIComponent(countryData.name.common)}`);
        const airportData = await res.json();
        console.log(airportData.data); // Add this line
        if (airportData.data && airportData.data.length) {
            const largeAirports = airportData.data
                .filter(airport => airport.type === 'international_airport' || airport.airport_size === 'large')
                .slice(0, 3);
            const topAirports = largeAirports.length >= 3
                ? largeAirports
                : airportData.data.slice(0, 5);
            airportBox.innerHTML = `
                <div class="airport-title">Airports</div>
                <ul>
                    ${topAirports.map(airport =>
                        `<li>
                            <strong>${airport.airport_name || 'N/A'}</strong><br>
                            Code: ${airport.iata_code || airport.icao_code || 'N/A'}<br>
                            Location: ${airport.city || airport.city_name || airport.airport_city || 'Unknown City'}, ${airport.country_name || countryData.name.common}
                        </li>`
                    ).join('')}
                </ul>
            `;
        } else {
            airportBox.innerHTML = '<div class="airport-title">Airports</div><p>No airport data available.</p>';
        }
    } catch (error) {
        airportBox.innerHTML = '<div class="airport-title">Airports</div><p>Error loading airport data.</p>';
    }
}
//premium feature only 
async function fetchCountryFact(countryName) {
    const apiKey = 'r1hbeZM9JOtJ0GO1QnuJ6A==lfPe7VfwB0TXhp0K'
; // Replace with your API Ninjas key
    try {
        const res = await fetch('https://api.api-ninjas.com/v1/facts?limit=10', {
            headers: { 'X-Api-Key': apiKey }
        });
        if (!res.ok) {
            console.error('API response not OK:', res.status, await res.text());
            return 'Error loading fact.';
        }
        const facts = await res.json();
        const countryFact = facts.find(fact =>
            fact.fact.toLowerCase().includes(countryName.toLowerCase())
        );
        return countryFact ? countryFact.fact : 'No country-specific fact found.';
    } catch (error) {
        console.error('Fetch error:', error);
        return 'Error loading fact.';
    }
}
//wikipedia summary fetch function
async function fetchWikipediaSummary(countryName) {
    const apiUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(countryName)}`;
    try {
        const res = await fetch(apiUrl);
        if (!res.ok) {
            console.error('Wikipedia API error:', res.status, await res.text());
            return 'No Wikipedia summary available.';
        }
        const data = await res.json();
        // Use plain text extract for easier trimming
        let summary = data.extract || 'No Wikipedia summary available.';
        // Limit to first 2 sentences
        const sentences = summary.match(/[^\.!\?]+[\.!\?]+/g);
         if (sentences && sentences.length > 1) {
            summary = sentences.slice(0, 5).join(' ');
        } 
        return summary;
    } catch (error) {
        console.error('Wikipedia fetch error:', error);
        return 'No Wikipedia summary available.';
    }
}




async function renderWeather(countryData) {
    const [lat, lon] = countryData.latlng || [];
    if (!(lat && lon)) return;
    try {
        const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&temperature_unit=fahrenheit&hourly=relative_humidity_2m,cloudcover&daily=temperature_2m_max,temperature_2m_min,weathercode&timezone=auto`);
        const data = await res.json();
        // --- Current Weather ---
        const weather = data.current_weather;
        const hourlyTimes = data.hourly?.time || [];
        const currentTime = weather?.time;
        let humidity = 'N/A';
        let cloudcover = 'N/A';
        if (currentTime && hourlyTimes.length) {
            let minDiff = Infinity;
            let closestIdx = -1;
            for (let i = 0; i < hourlyTimes.length; i++) {
                const diff = Math.abs(new Date(hourlyTimes[i]) - new Date(currentTime));
                if (diff < minDiff) {
                    minDiff = diff;
                    closestIdx = i;
                }
            }
            if (closestIdx !== -1) {
                humidity = data.hourly.relative_humidity_2m[closestIdx];
                cloudcover = data.hourly.cloudcover[closestIdx];
            }
        }
        if (weather) {
            document.getElementById('weather-temp').textContent = `${weather.temperature}°F`;
            document.getElementById('weather-wind').textContent = `${weather.windspeed} mph`;
            document.getElementById('weather-winddir').textContent = `${weather.winddirection}°`;
            const iconHtml = weatherCodeIcons[weather.weathercode] || '';
            const iconColor = weatherCodeColors[weather.weathercode] || "#fff";
            document.getElementById('weather-icon').innerHTML =
                `<span style="color: ${iconColor};">${iconHtml}</span>`;
            document.getElementById('weather-code').textContent =
                weatherCodeDescriptions[weather.weathercode] || weather.weathercode;
            document.getElementById('weather-humidity').textContent = humidity !== undefined ? `${humidity}%` : 'N/A';
            document.getElementById('weather-cloud').textContent = cloudcover !== undefined ? `${cloudcover}%` : 'N/A';
        } else {
            document.getElementById('weather-temp').textContent = 'Not available';
            document.getElementById('weather-wind').textContent = 'Not available';
            document.getElementById('weather-winddir').textContent = 'Not available';
            document.getElementById('weather-icon').innerHTML = '';
            document.getElementById('weather-code').textContent = 'Not available';
            document.getElementById('weather-humidity').textContent = "Not available";
            document.getElementById('weather-cloud').textContent = 'Not available';
        }

        // --- 7-Day Forecast ---
        const days = data.daily.time;
        const maxTemps = data.daily.temperature_2m_max;
        const minTemps = data.daily.temperature_2m_min;
        const codes = data.daily.weathercode;
        let forecastHtml = `
            <div class="forecast-title">7-Day Forecast</div>
            <ul class="forecast-list">
        `;
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Midnight today
        for (let i = 0; i < days.length; i++) {
            const dateObj = new Date(days[i]);
            dateObj.setHours(0, 0, 0, 0); // Midnight for comparison
            if (dateObj < today) continue; // Skip days before today
            let formattedDate;
            if (dateObj.getTime() === today.getTime()) {
                formattedDate = "Today";
            } else {
                const options = { weekday: 'short', month: 'long', day: 'numeric' };
                formattedDate = dateObj.toLocaleDateString(undefined, options).replace(',', '');
            }
            forecastHtml += `
                <li class="forecast-row">
                    <span class="forecast-date">${formattedDate}</span>
                    <span class="min-temp">Low ${minTemps[i]}°F</span>
                    <span class="max-temp">${maxTemps[i]}°F High</span>
                    <span class="weather-icon" style="color: ${weatherCodeColors[codes[i]] || '#fff'};">
                        ${weatherCodeIcons[codes[i]] || ''}
                    </span>
                    <span class="forecast-desc">${weatherCodeDescriptions[codes[i]] || codes[i]}</span>
                </li>
            `;
        }
        forecastHtml += '</ul>';
        const forecastSpan = document.getElementById('forecast-span');
        if (forecastSpan) {
            forecastSpan.innerHTML = forecastHtml;
        }
    } catch (error) {
        const forecastSpan = document.getElementById('forecast-span');
        if (forecastSpan) {
            forecastSpan.innerHTML = '<p>Error loading weather data.</p>';
        }
    }
}

// --- Main Function ---

async function getCountryInfo(country) {
    try {
        const countryData = await fetchCountryData(country);
        const localData = await fetchLocalData();
        const localFact = localData[country]?.fun_fact || 'No fun fact available.';
        const history = localData[country]?.history || 'No history available.';
        const airports = buildAirportsList(localData[country]?.airports);
        const attractions = buildAttractionsList(localData[country]?.attractions);
        const food = buildFoodList(localData[country]?.food);
        const culturalEvents = buildCulturalEventsList(localData[country]?.cultural_events);
        const apiFact = await fetchWikipediaSummary(countryData.name.common);
       // const apiFact = await fetchCountryFact(country);

        const infoHtml = buildCountryInfoHtml(
            countryData,
            localFact,
            history,
            airports,
            attractions,
            food,
            culturalEvents,
            apiFact
            
            
        );
        document.getElementById('info').innerHTML = infoHtml;

        await renderAirports(countryData);
        await renderWeather(countryData);

    } catch (error) {
        showError('Could not fetch country info. Please try again later.');
        console.error(error);
    }
}

// --- Autocomplete logic ---
let allCountries = [];
fetch('https://restcountries.com/v3.1/all?fields=name,flags')
    .then(res => res.json())
    .then(data => {
        if (Array.isArray(data)) {
            allCountries = data.map(c => ({
                name: c.name.common,
                flag: c.flags && c.flags.png ? c.flags.png : ''
            })).sort((a, b) => a.name.localeCompare(b.name));
        } else {
            allCountries = [];
            console.error('Unexpected API response:', data);
        }
    })
    .catch(error => {
        console.error('Error fetching country list:', error);
    });

const searchInput = document.getElementById('search');
const autocompleteList = document.getElementById('autocomplete-list');
// Add event listener for the search button
searchInput.addEventListener('input', function() {
    if (!allCountries.length) return;
    const val = this.value.trim();
    autocompleteList.innerHTML = '';
    if (!val) return;
    const matches = allCountries.filter(country =>
        country.name.toLowerCase().startsWith(val.toLowerCase())
    );
    //checks for no matches
     if (matches.length === 0) {
        const item = document.createElement('div');
        item.classList.add('autocomplete-item');
        item.style.color = '#ff9800';
        item.style.cursor = 'default';
        item.textContent = 'No countries with that name';
        autocompleteList.appendChild(item);
        return;
    }
    matches.forEach(country => {
        // Highlight the matching part
        const matchLen = val.length;
        const countryName = country.name;
        const highlighted =
            `<span class="autocomplete-highlight">${countryName.slice(0, matchLen)}</span>${countryName.slice(matchLen)}`;
        const item = document.createElement('div');
        item.classList.add('autocomplete-item');
        item.innerHTML = `
            <img src="${country.flag}" alt="Flag of ${country.name}" style="width:22px;height:16px;vertical-align:middle;margin-right:8px;border-radius:2px;">
            <span>${highlighted}</span>
        `;
        // Add click event to the item
        item.addEventListener('click', function() {
            searchInput.value = country.name;
            autocompleteList.innerHTML = '';
            getCountryInfo(country.name.toLowerCase());
            searchInput.value = '';
        });
        autocompleteList.appendChild(item);
    });
});



function handleSearchClick() {
    const val = searchInput.value.trim();
    if (!val) {
        alert('Please enter a country to search.');
        return;
    }
    // Only search if the input exactly matches a country name
    const found = allCountries.find(
        country => country.name.toLowerCase() === val.toLowerCase()
    );
    if (!found) {
        alert('Please enter the full country name as shown in the suggestions.');
        return;
    }
    getCountryInfo(val.toLowerCase());
    searchInput.value = '';
}





// Wait until the DOM is fully loaded before running this code
document.addEventListener("DOMContentLoaded", function() {
  // Get the "Back to Top" button by its ID
  var backToTop = document.getElementById("backToTop");

  // Listen for scroll events on the window
  window.addEventListener("scroll", function() {
    // If the user has scrolled down more than 600px, show the button
    // Otherwise, hide the button
    backToTop.style.display = window.scrollY > 600 ? "block" : "none";
  });

  // When the button is clicked, smoothly scroll back to the top of the page
  backToTop.onclick = function() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
});

