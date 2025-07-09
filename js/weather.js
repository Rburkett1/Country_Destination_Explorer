// --- Weather Code Mappings ---
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

// --- Helper: Degrees to Compass ---
function degreesToCompass(degrees) {
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    const index = Math.round(degrees / 45) % 8;
    return directions[index];
}

// --- Weather API Call ---
async function fetchWeatherData(lat, lon) {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&temperature_unit=fahrenheit&hourly=relative_humidity_2m,cloudcover&daily=temperature_2m_max,temperature_2m_min,weathercode&timezone=auto`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Weather API error');
    return res.json();
}

// --- Render Weather (UI logic, optional) ---
async function renderWeather(countryData) {
    const [lat, lon] = countryData.latlng || [];
    if (!(lat && lon)) return;
    try {
        const data = await fetchWeatherData(lat, lon);
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
            document.getElementById('weather-winddir').innerHTML =
                ` ${weather.winddirection}° ${degreesToCompass(weather.winddirection)} 
                <i id="wind-arrow" class="fas fa-arrow-up"></i>`;
            document.getElementById('wind-arrow').style.transform =
                `rotate(${weather.winddirection}deg)`;
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