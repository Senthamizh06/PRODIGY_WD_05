const apiKey = '78d5705d278fafd467ae8ec03a7d6914';

function getWeatherByCity() {
    const city = document.getElementById('city-input').value;
    const unit = document.getElementById('unit-select').value;
    clearPreviousResults();
    if (city) {
        fetchWeatherData(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${unit}`);
    } else {
        displayError('Please enter a city name.');
    }
}

function getWeatherByLocation() {
    const unit = document.getElementById('unit-select').value;
    clearPreviousResults();
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            fetchWeatherData(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=${unit}`);
        }, () => {
            displayError('Unable to retrieve your location.');
        });
    } else {
        displayError('Geolocation is not supported by this browser.');
    }
}

function fetchWeatherData(url) {
    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('City not found or other error');
            }
            return response.json();
        })
        .then(data => displayWeather(data))
        .catch(error => displayError('Error fetching weather data: ' + error.message));
}

function displayWeather(data) {
    const location = document.getElementById('location');
    const description = document.getElementById('description');
    const temperature = document.getElementById('temperature');
    const humidity = document.getElementById('humidity');
    const wind = document.getElementById('wind');
    const sunrise = document.getElementById('sunrise');
    const sunset = document.getElementById('sunset');

    const unit = document.getElementById('unit-select').value;
    const tempUnit = unit === 'metric' ? '°C' : '°F';

    location.textContent = `${data.name}, ${data.sys.country}`;
    description.textContent = `${data.weather[0].description}`;
    temperature.textContent = `Temperature: ${data.main.temp}${tempUnit}`;
    humidity.textContent = `Humidity: ${data.main.humidity}%`;
    wind.textContent = `Wind Speed: ${data.wind.speed} m/s`;

    const sunriseTime = new Date(data.sys.sunrise * 1000).toLocaleTimeString();
    const sunsetTime = new Date(data.sys.sunset * 1000).toLocaleTimeString();

    sunrise.textContent = `Sunrise: ${sunriseTime}`;
    sunset.textContent = `Sunset: ${sunsetTime}`;
}

function displayError(message) {
    const errorMessage = document.getElementById('error-message');
    errorMessage.textContent = message;
}

function clearPreviousResults() {
    document.getElementById('location').textContent = '';
    document.getElementById('description').textContent = '';
    document.getElementById('temperature').textContent = '';
    document.getElementById('humidity').textContent = '';
    document.getElementById('wind').textContent = '';
    document.getElementById('sunrise').textContent = '';
    document.getElementById('sunset').textContent = '';
    document.getElementById('error-message').textContent = '';
}
