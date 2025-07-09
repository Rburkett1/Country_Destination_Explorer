let allCountries = [];

// --- Helper Functions ---

function getExactCountryData(countryName, countriesArray) {
    // Try to find an exact match (case-insensitive)
    const exact = countriesArray.find(
        c => c.name.common.toLowerCase() === countryName.toLowerCase()
    );
    if (exact) return exact;

    // Fallback: first result
    return countriesArray[0];
}

async function fetchCountryData(country) {
    const res = await fetch(`https://restcountries.com/v3.1/name/${country}`);
    if (!res.ok) throw new Error('Network response was not ok');
    const data = await res.json();
    return getExactCountryData(country, data);
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


function buildCountryInfoHtml(countryData, localFact, history, airports, attractions, food, culturalEvents, apiFact) {
    return `
        <!-----/  Section 1  /----->
        <div class="country-info-container-1">   
            <div class="text-section">                      
                <div class="country">${countryData.name.common} ${countryData.coatOfArms?.svg
                    ? `<img src="${countryData.coatOfArms.svg}" alt="Coat of Arms of ${countryData.name.common}" class="coat-of-arms-img">`
                    : 'Not available'}</div>
                <div class="capital"><strong>Capital:</strong> ${countryData.capital?.[0] || 'N/A'}</div>         
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
                <div class="weather-title">Today in ${countryData.capital?.[0] || 'NA'}, ${countryData.name.common}</div>
                <div class="weather-top">
                    <div id="weather-icon" class="weather-icon"></div>       
                    <div><span id="weather-temp"> Loading...</span> </div>
                </div>            
                <div class="weather-row"><span>Wind Direction:</span> <span id="weather-winddir">...</span></div>
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
            <div class="info-box-5" id="airports"></div>
        </div>
    `;
}

function showError(message) {
    document.getElementById('info').innerHTML = `<p>${message}</p>`;
}

// --- Render Functions ---

function renderAllCountries(countries) {
    const container = document.getElementById('country-container');
    if (!container) return;
    container.innerHTML = buildAllCountriesHtml(countries);
}

function buildAllCountriesHtml(countries) {
    return countries.map(country => `
        <div class="country-card" onclick="window.location.href='country.html?name=${encodeURIComponent(country.name.common)}'">           
            <img class="all-images" src="${country.flags?.png || 'images/default.jpg'}" alt="Flag of ${country.name.common}">
            <div><strong>${country.name.common}</strong></div>
            <div>Capital: ${country.capital?.[0] || 'N/A'}</div>
            <div>Region: ${country.region || 'N/A'}</div>
            <div>Population: ${country.population?.toLocaleString() || 'N/A'}</div>
        </div>
    `).join('');
}

// --- Filter Logic ---

function highlightActiveFilter(buttonId) {
    document.querySelectorAll('.filter-bar button').forEach(btn => {
        btn.classList.remove('active-filter');
    });
    const btn = document.getElementById(buttonId);
    if (btn) btn.classList.add('active-filter');
}

function filterRegion(regionCountries, buttonId) {
    highlightActiveFilter(buttonId);
    if (!allCountries || !allCountries.length) {
        console.warn('allCountries not loaded yet.');
        return;
    }
    const filtered = allCountries.filter(c => regionCountries.includes(c.name.common));
    renderAllCountries(filtered);
}

function filterAll() {
    if (!allCountries || !allCountries.length) {
        console.warn('allCountries not loaded yet.');
        return;
    }
    renderAllCountries(allCountries);
    highlightActiveFilter('All'); // Optional: highlight the "All Countries" button
}

function filterNorthAmerica() {
    filterRegion(
        ["Canada", "United States", "United States of America", "Mexico"],
        "north-america-btn"
    );
}

function filterCentralAmerica() {
    filterRegion(
        ["Belize", "Costa Rica", "El Salvador", "Guatemala", "Honduras", "Nicaragua", "Panama"],
        "central-america-btn"
    );
}

function filterSouthAmerica() {
    filterRegion(
        ["Argentina", "Bolivia", "Brazil", "Chile", "Colombia", "Ecuador",
         "Guyana", "Paraguay", "Peru", "Suriname", "Uruguay", "Venezuela"],
        "south-america-btn"
    );
}

function filterEurope() {
    filterRegion(
        ["Albania", "Andorra", "Austria", "Belarus", "Belgium", "Bosnia and Herzegovina",
        "Bulgaria", "Croatia", "Czech Republic", "Denmark", "Estonia", "Finland",
        "France", "Germany", "Greece", "Hungary", "Iceland", "Ireland", "Italy",
        "Latvia", "Liechtenstein", "Lithuania", "Luxembourg", "Malta", "Moldova",
        "Monaco", "Montenegro", "Netherlands", "North Macedonia", "Norway", "Poland",
        "Portugal", "Romania", "Russia", "San Marino", "Serbia", "Slovakia",
        "Slovenia", "Spain", "Sweden", "Switzerland", "Ukraine", "United Kingdom",
        "Vatican City"],
        "europe-btn"
    );
}

function filterCaribbean() {
    filterRegion(
        [
            "Antigua and Barbuda", "Bahamas", "Barbados", "Cuba", "Dominica",
            "Dominican Republic", "Grenada", "Haiti", "Jamaica", "Saint Kitts and Nevis",
            "Saint Lucia", "Saint Vincent and the Grenadines", "Trinidad and Tobago"
        ],
        "caribbean-btn"
    );
}

function filterMiddleEast() {
    filterRegion(
        [
            "Bahrain", "Cyprus", "Egypt", "Iran", "Iraq", "Israel", "Jordan", "Kuwait",
            "Lebanon", "Oman", "Palestine", "Qatar", "Saudi Arabia", "Syria",
            "Turkey", "United Arab Emirates", "Yemen"
        ],
        "middle-east-btn"
    );
}

function filterAfrica() {
    filterRegion(
        [
            "Algeria", "Angola", "Benin", "Botswana", "Burkina Faso", "Burundi", "Cabo Verde",
            "Cameroon", "Central African Republic", "Chad", "Comoros", "Congo", "Democratic Republic of the Congo",
            "Djibouti", "Egypt", "Equatorial Guinea", "Eritrea", "Eswatini", "Ethiopia", "Gabon",
            "Gambia", "Ghana", "Guinea", "Guinea-Bissau", "Ivory Coast", "Kenya", "Lesotho",
            "Liberia", "Libya", "Madagascar", "Malawi", "Mali", "Mauritania", "Mauritius",
            "Morocco", "Mozambique", "Namibia", "Niger", "Nigeria", "Rwanda", "Sao Tome and Principe",
            "Senegal", "Seychelles", "Sierra Leone", "Somalia", "South Africa", "South Sudan",
            "Sudan", "Tanzania", "Togo", "Tunisia", "Uganda", "Zambia", "Zimbabwe"
        ],
        "africa-btn"
    );
}

function filterAsia() {
    filterRegion(
        [
            "Afghanistan", "Armenia", "Azerbaijan", "Bahrain", "Bangladesh", "Bhutan", "Brunei",
            "Cambodia", "China", "Cyprus", "Georgia", "India", "Indonesia", "Iran", "Iraq",
            "Israel", "Japan", "Jordan", "Kazakhstan", "Kuwait", "Kyrgyzstan", "Laos",
            "Lebanon", "Malaysia", "Maldives", "Mongolia", "Myanmar", "Nepal", "North Korea",
            "Oman", "Pakistan", "Palestine", "Philippines", "Qatar", "Russia", "Saudi Arabia",
            "Singapore", "South Korea", "Sri Lanka", "Syria", "Taiwan", "Tajikistan", "Thailand",
            "Timor-Leste", "Turkey", "Turkmenistan", "United Arab Emirates", "Uzbekistan", "Vietnam", "Yemen"
        ],
        "asia-btn"
    );
}

function filterOceania() {
    filterRegion(
        [
            "Australia", "Fiji", "Kiribati", "Marshall Islands", "Micronesia", "Nauru",
            "New Zealand", "Palau", "Papua New Guinea", "Samoa", "Solomon Islands",
            "Tonga", "Tuvalu", "Vanuatu"
        ],
        "oceania-btn"
    );
}

function filterSort() {
    document.getElementById('filterSortPopup').style.display = 'flex';
}
function closeFilterSortPopup() {
    document.getElementById('filterSortPopup').style.display = 'none';
}

function togglePopulationFilter() {
    const checkbox = document.getElementById('popOver10M');
    if (checkbox.checked) {
        const filtered = allCountries
            .filter(c => c.population > 10000000)
            .sort((a, b) => b.population - a.population); // Sort high to low
        renderAllCountries(filtered);
    } else {
        filterAll();
    }
}

// --- Wikipedia Summary Fetch ---
async function fetchWikipediaSummary(countryName) {
    const apiUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(countryName)}`;
    try {
        const res = await fetch(apiUrl);
        if (!res.ok) {
            console.error('Wikipedia API error:', res.status, await res.text());
            return 'No Wikipedia summary available.';
        }
        const data = await res.json();
        let summary = data.extract || 'No Wikipedia summary available.';
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


// --- Airports ---
async function renderAirports(countryData) {
    const apiKey = '857e84fcc8e43fb6604ba22eb772c283';
    const airportBox = document.getElementById('airports');
    if (!airportBox) return;
    try {
        const res = await fetch(`https://api.aviationstack.com/v1/airports?access_key=${apiKey}&country_name=${encodeURIComponent(countryData.name.common)}`);
        const airportData = await res.json();
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

// --- Fetch All Countries Once & Setup Autocomplete ---
document.addEventListener("DOMContentLoaded", function() {
    fetch('https://restcountries.com/v3.1/all?fields=name,flags,capital,region,population')
        .then(res => res.json())
        .then(data => {
            allCountries = data.sort((a, b) => a.name.common.localeCompare(b.name.common));
            renderAllCountries(allCountries);
            document.querySelectorAll('.filter-bar button').forEach(btn => btn.disabled = false);
        })
        .catch(error => {
            console.error('Error loading countries:', error);
            const container = document.getElementById('country-container');
            if (container) container.textContent = 'Failed to load country data.';
        });

    // --- Autocomplete logic ---
    const searchInput = document.getElementById('search');
    const autocompleteList = document.getElementById('autocomplete-list');
    if (searchInput && autocompleteList) {
        searchInput.addEventListener('input', function() {
            if (!allCountries.length) return;
            const val = this.value.trim();
            autocompleteList.innerHTML = '';
            if (!val) return;
            const matches = allCountries.filter(country =>
                country.name.common.toLowerCase().startsWith(val.toLowerCase())
            );
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
                const matchLen = val.length;
                const countryName = country.name.common;
                const highlighted =
                    `<span class="autocomplete-highlight">${countryName.slice(0, matchLen)}</span>${countryName.slice(matchLen)}`;
                const item = document.createElement('div');
                item.classList.add('autocomplete-item');
                item.innerHTML = `
                    <img src="${country.flags?.png || ''}" alt="Flag of ${countryName}" style="width:22px;height:16px;vertical-align:middle;margin-right:8px;border-radius:2px;">
                    <span>${highlighted}</span>
                `;
                item.addEventListener('click', function() {
                    searchInput.value = countryName;
                    autocompleteList.innerHTML = '';
                    getCountryInfo(countryName.toLowerCase());
                    searchInput.value = '';
                });
                autocompleteList.appendChild(item);
            });
        });
    }

    // --- Search Button Logic ---
    const searchBtn = document.querySelector('.searchbar button');
    if (searchBtn && searchInput) {
        searchBtn.addEventListener('click', function() {
            const val = searchInput.value.trim();
            if (!val) {
                alert('Please enter a country to search.');
                return;
            }
            const found = allCountries.find(
                country => country.name.common.toLowerCase() === val.toLowerCase()
            );
            if (!found) {
                alert('Please enter the full country name as shown in the suggestions.');
                return;
            }
            getCountryInfo(val.toLowerCase());
            searchInput.value = '';
        });
    }

    // --- Back to Top Button Logic ---
    var backToTop = document.getElementById("backToTop");
    if (backToTop) {
        window.addEventListener("scroll", function() {
            backToTop.style.display = window.scrollY > 600 ? "block" : "none";
        });
        backToTop.onclick = function() {
            window.scrollTo({ top: 0, behavior: "smooth" });
        };
    }
});