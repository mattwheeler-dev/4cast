// DOM variables
const searchBar = document.querySelector('#search-input');
const searchBtn = document.querySelector('#search-btn');
const errorMsg = document.querySelector('#error-msg');
const fBtn = document.querySelector('#f-btn');
const cBtn = document.querySelector('#c-btn');
const locationDisplay = document.querySelector('#location');
const dateDisplays = document.querySelectorAll('.date');
const weatherDisplays = document.querySelectorAll('.weather');
const icons = document.querySelectorAll('.icon');
const temps = document.querySelectorAll('.temp');
const lows = document.querySelectorAll('.low');
const highs = document.querySelectorAll('.high');
const feelsLike = document.querySelector('.feels-temp');
const humidity = document.querySelector('.humidity');
const wind = document.querySelector('.wind');

// Add event listeners
searchBtn.addEventListener('click', () => {
	getForecast(searchBar.value);
});
fBtn.addEventListener('click', () => {
	getForecast(locationDisplay.textContent, 'imp');
});
cBtn.addEventListener('click', () => {
	getForecast(locationDisplay.textContent, 'met');
});

// Fetch weather data (default to imperial measurements)
async function getForecast(target, units = 'imp') {
	try {
		const response = await fetch(
			`https://api.weatherapi.com/v1/forecast.json?key=994937b9ec824b068a6232904242603&q=${target}&days=3&aqi=no&alerts=no`,
			{ mode: 'cors' }
		);

		if (!response.ok) {
			throw new Error('Network error');
		}

		const weatherData = await response.json();

		if (weatherData.error) {
			throw new Error('Location not found');
		}

		displayForecast(weatherData, units);
	} catch (error) {
		handleForecastError(error);
	}
}

// Display weather data
const displayForecast = (weatherData, units) => {
	const locationData = weatherData.location;
	const currentData = weatherData.current;
	const forecastData = weatherData.forecast.forecastday;

	// Display searched location & current date
	const currentDay = new Date(locationData.localtime);
	locationDisplay.textContent = locationData.name;
	dateDisplays[0].textContent = currentDay.toDateString();
	// Display forecast dates
	for (let i = 1; i <= forecastData.length; i++) {
		const nextDay = new Date(currentDay);
		nextDay.setDate(currentDay.getDate() + i);
		dateDisplays[i].textContent = nextDay.toDateString();
	}

	// Display current weather data
	weatherDisplays[0].textContent = currentData.condition.text;
	icons[0].src = currentData.condition.icon;
	icons[0].alt = `icon depicting ${currentData.condition.text} weather`;
	humidity.textContent = `Humidity: ${currentData.humidity}%`;
	// Change data based on selected units
	if (units == 'imp') {
		fBtn.classList.add('active');
		cBtn.classList.remove('active');
		temps[0].textContent = `${Math.floor(currentData.temp_f)}\u00B0 F`;
		feelsLike.textContent = `Feels Like: ${Math.floor(
			currentData.feelslike_f
		)}\u00B0 F`;
		wind.textContent = `Wind: ${currentData.wind_mph}mph ${currentData.wind_dir}`;
	} else if (units == 'met') {
		cBtn.classList.add('active');
		fBtn.classList.remove('active');
		temps[0].textContent = `${Math.floor(currentData.temp_c)}\u00B0 C`;
		feelsLike.textContent = `Feels Like: ${Math.floor(
			currentData.feelslike_c
		)}\u00B0 C`;
		wind.textContent = `Wind: ${currentData.wind_kph}kph ${currentData.wind_dir}`;
	}

	// Display forecast data
	for (i = 1; i <= forecastData.length; i++) {
		weatherDisplays[i].textContent = forecastData[i - 1].day.condition.text;
		icons[i].src = forecastData[i - 1].day.condition.icon;
		icons[i].alt = `icon depicting ${
			forecastData[i - 1].day.condition.text
		} weather`;
		// Change forecast data based on selected units
		if (units == 'imp') {
			temps[i].textContent =
				Math.floor(forecastData[i - 1].day.avgtemp_f) + `\u00B0 F`;
			lows[i - 1].textContent = `Low: ${Math.floor(
				forecastData[i - 1].day.mintemp_f
			)}\u00B0 F`;
			highs[i - 1].textContent = `High: ${Math.floor(
				forecastData[i - 1].day.maxtemp_f
			)}\u00B0 F`;
		} else if (units == 'met') {
			temps[i].textContent =
				Math.floor(forecastData[i - 1].day.avgtemp_c) + `\u00B0 C`;
			lows[i - 1].textContent = `Low: ${Math.floor(
				forecastData[i - 1].day.mintemp_c
			)}\u00B0 C`;
			highs[i - 1].textContent = `High: ${Math.floor(
				forecastData[i - 1].day.maxtemp_c
			)}\u00B0 C`;
		}
	}
};

// Error handling
const handleForecastError = (error) => {
	let message = 'Something went wrong. Please try again.';
	if (error.message === 'Location not found') {
		message = 'City not found. Please try again.';
	}
	showError(message);
};

const showError = (msg) => {
	errorMsg.textContent = msg;
	errorMsg.classList.add('visible');
	setTimeout(() => {
		errorMsg.classList.remove('visible');
	}, 5000);
};

// Init page with Seattle as default location
getForecast('Seattle');
