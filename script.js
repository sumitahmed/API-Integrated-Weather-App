/**
 * Weather Flight App - Exact Match to Reference Image
 */

document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const cityInput = document.getElementById('city-input');
    const searchBtn = document.getElementById('search-btn');
    const weatherDisplay = document.getElementById('weather-display');
    const weekGrid = document.getElementById('week-grid');
    const loading = document.getElementById('loading');

    // API Configuration
    const API_KEY = "your api key";
    const BASE_URL = "https://api.openweathermap.org/data/2.5";

    // Weather icon mapping
    // Enhanced Weather icon mapping with your downloaded icons
const weatherIcons = {
    // OpenWeatherMap icon codes to your local icons
    '01d': 'assets/icons/sunny.png',           // clear sky day
    '01n': 'assets/icons/clear-night.png',     // clear sky night
    '02d': 'assets/icons/partly-cloudy.png',   // few clouds day
    '02n': 'assets/icons/partly-cloudy.png',   // few clouds night
    '03d': 'assets/icons/cloudy.png',          // scattered clouds
    '03n': 'assets/icons/cloudy.png',          // scattered clouds
    '04d': 'assets/icons/cloudy.png',          // broken clouds
    '04n': 'assets/icons/cloudy.png',          // broken clouds
    '09d': 'assets/icons/rainy.png',           // shower rain
    '09n': 'assets/icons/rainy.png',           // shower rain
    '10d': 'assets/icons/rainy.png',           // rain day
    '10n': 'assets/icons/rainy.png',           // rain night
    '11d': 'assets/icons/stormy.png',          // thunderstorm
    '11n': 'assets/icons/stormy.png',          // thunderstorm
    '13d': 'assets/icons/snowy.png',           // snow
    '13n': 'assets/icons/snowy.png',           // snow
    '50d': 'assets/icons/fog.png',             // mist/fog
    '50n': 'assets/icons/fog.png'              // mist/fog
};

// Update the displayWeatherCard function to use actual images
function displayWeatherCard(data) {
    const temp = Math.round(data.main.temp);
    const condition = data.weather[0].main.toLowerCase();
    const description = data.weather[0].description;
    const iconCode = data.weather[0].icon;
    const iconPath = weatherIcons[iconCode] || 'assets/icons/sunny.png';

    const weatherCard = document.createElement('div');
    weatherCard.className = 'weather-card';
    weatherCard.innerHTML = `
        <div class="weather-icon-img">
            <img src="${iconPath}" alt="${description}" />
        </div>
        <div class="weather-location">${data.name}</div>
        <div class="weather-temp">${temp}°</div>
        <div class="weather-desc">${description}</div>
        <div class="weather-details">
            Humidity: ${data.main.humidity}%<br>
            Wind: ${Math.round(data.wind.speed * 3.6)} km/h<br>
            Feels like: ${Math.round(data.main.feels_like)}°
        </div>
    `;

    weatherDisplay.appendChild(weatherCard);

    // Add entrance animation
    weatherCard.style.opacity = '0';
    weatherCard.style.transform = 'translateY(20px)';
    setTimeout(() => {
        weatherCard.style.transition = 'all 0.5s ease';
        weatherCard.style.opacity = '1';
        weatherCard.style.transform = 'translateY(0)';
    }, 100);
}


    // Initialize app
    initializeApp();

    // Event Listeners
    searchBtn.addEventListener('click', handleSearch);
    cityInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleSearch();
    });

    async function initializeApp() {
        generateWeeklyForecast();
        // Load default cities
        const defaultCities = ['Sydney', 'Vancouver', 'Melbourne'];
        for (const city of defaultCities) {
            await getWeatherData(city, false);
        }
    }

    async function handleSearch() {
        const city = cityInput.value.trim();
        if (!city) return;

        await getWeatherData(city, true);
        cityInput.value = '';
    }

    async function getWeatherData(city, clearExisting = false) {
        showLoading();

        try {
            const response = await fetch(`${BASE_URL}/weather?q=${city}&appid=${API_KEY}&units=metric`);
            
            if (!response.ok) {
                throw new Error('City not found');
            }

            const data = await response.json();
            
            if (clearExisting) {
                weatherDisplay.innerHTML = '';
            }
            
            displayWeatherCard(data);

        } catch (error) {
            console.error('Error fetching weather:', error);
            showError(city);
        } finally {
            hideLoading();
        }
    }

    function displayWeatherCard(data) {
        const temp = Math.round(data.main.temp);
        const condition = data.weather[0].main.toLowerCase();
        const description = data.weather[0].description;
        const icon = weatherIcons[condition] || '🌤️';

        const weatherCard = document.createElement('div');
        weatherCard.className = 'weather-card';
        weatherCard.innerHTML = `
            <div class="weather-icon">${icon}</div>
            <div class="weather-location">${data.name}</div>
            <div class="weather-temp">${temp}°</div>
            <div class="weather-desc">${description}</div>
            <div class="weather-details">
                Humidity: ${data.main.humidity}%<br>
                Wind: ${Math.round(data.wind.speed * 3.6)} km/h<br>
                Feels like: ${Math.round(data.main.feels_like)}°
            </div>
        `;

        weatherDisplay.appendChild(weatherCard);

        // Add entrance animation
        weatherCard.style.opacity = '0';
        weatherCard.style.transform = 'translateY(20px)';
        setTimeout(() => {
            weatherCard.style.transition = 'all 0.5s ease';
            weatherCard.style.opacity = '1';
            weatherCard.style.transform = 'translateY(0)';
        }, 100);
    }

    function generateWeeklyForecast() {
        const days = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];
        const temps = ['22°', '19°', '24°', '26°', '23°', '20°', '18°'];
        const icons = ['☀️', '☁️', '🌧️', '☀️', '☁️', '🌧️', '⛈️'];

        weekGrid.innerHTML = '';
        
        days.forEach((day, index) => {
            const dayItem = document.createElement('div');
            dayItem.className = 'day-item';
            dayItem.innerHTML = `
                <div class="day-name">${day}</div>
                <div class="day-icon">${icons[index]}</div>
                <div class="day-temp">${temps[index]}</div>
            `;
            weekGrid.appendChild(dayItem);
        });
    }

    function showError(city) {
        const errorCard = document.createElement('div');
        errorCard.className = 'weather-card';
        errorCard.style.borderColor = '#ff6b6b';
        errorCard.innerHTML = `
            <div class="weather-icon">❌</div>
            <div class="weather-location">${city}</div>
            <div class="weather-desc">City not found</div>
            <div class="weather-details">Please check the city name and try again</div>
        `;
        weatherDisplay.appendChild(errorCard);
    }

    function showLoading() {
        loading.classList.remove('hidden');
    }

    function hideLoading() {
        loading.classList.add('hidden');
    }
});
