// DOM VARIABLES
const searchBar = document.querySelector("#search");
const searchBtn = document.querySelector("#search-btn");
const fBtn = document.querySelector("#f-btn");
const cBtn = document.querySelector("#c-btn");
const locationDisplay = document.querySelector("#location");
const dateDisplays = document.querySelectorAll(".date");
const weatherDisplays = document.querySelectorAll(".weather");
const icons = document.querySelectorAll(".icon");
const temps = document.querySelectorAll(".temp");
const lows = document.querySelectorAll(".low");
const highs = document.querySelectorAll(".high");
const feelsLike = document.querySelector(".feels-temp");
const humidity = document.querySelector(".humidity");
const wind = document.querySelector(".wind");

// ADD EVENT LISTENERS
searchBtn.addEventListener("click", () => {
	getForecast(searchBar.value);
});
fBtn.addEventListener("click", () => {
	getForecast(locationDisplay.textContent, "imp");
});
cBtn.addEventListener("click", () => {
	getForecast(locationDisplay.textContent, "met");
});

// GET & DISPLAY CURRENT WEATHER + 3-DAY FORECAST (IMPERIAL MEASUREMENTS DEFAULT)
async function getForecast(target, units = "imp") {
	const response = await fetch(
		`http://api.weatherapi.com/v1/forecast.json?key=994937b9ec824b068a6232904242603&q=${target}&days=3&aqi=no&alerts=no`,
		{ mode: "cors" }
	);
	const weatherData = await response.json();
	const locationData = weatherData.location;
	const currentData = weatherData.current;
	const forecastData = weatherData.forecast.forecastday;

	// DISPLAY CURRENT LOCATION & DATE
	const currentDay = new Date(locationData.localtime);
	locationDisplay.textContent = locationData.name;
	dateDisplays[0].textContent = currentDay.toDateString();
	// DISPLAY FORECAST DATES
	for (let i = 1; i <= forecastData.length; i++) {
		const nextDay = new Date(currentDay);
		nextDay.setDate(currentDay.getDate() + i);
		dateDisplays[i].textContent = nextDay.toDateString();
	}

	// DISPLAY CURRENT WEATHER
	weatherDisplays[0].textContent = currentData.condition.text;
	icons[0].src = currentData.condition.icon;
	icons[0].alt = `icon depicting ${currentData.condition.text} weather`;
	humidity.textContent = `Humidity: ${currentData.humidity}%`;
	// DISPLAY WITH SELECTED UNITS
	if (units == "imp") {
		fBtn.classList.add("active");
		cBtn.classList.remove("active");
		temps[0].textContent = `${Math.floor(currentData.temp_f)}\u00B0 F`;
		feelsLike.textContent = `Feels Like: ${Math.floor(
			currentData.feelslike_f
		)}\u00B0 F`;
		wind.textContent = `Wind: ${currentData.wind_mph}mph ${currentData.wind_dir}`;
	} else if (units == "met") {
		cBtn.classList.add("active");
		fBtn.classList.remove("active");
		temps[0].textContent = `${Math.floor(currentData.temp_c)}\u00B0 C`;
		feelsLike.textContent = `Feels Like: ${Math.floor(
			currentData.feelslike_c
		)}\u00B0 C`;
		wind.textContent = `Wind: ${currentData.wind_kph}kph ${currentData.wind_dir}`;
	}

	// DISPLAY FORECAST WEATHER
	for (i = 1; i <= forecastData.length; i++) {
		weatherDisplays[i].textContent = forecastData[i - 1].day.condition.text;
		icons[i].src = forecastData[i - 1].day.condition.icon;
		icons[i].alt = `icon depicting ${
			forecastData[i - 1].day.condition.text
		} weather`;
		// DISPLAY WITH SELECTED UNITS
		if (units == "imp") {
			temps[i].textContent =
				Math.floor(forecastData[i - 1].day.avgtemp_f) + `\u00B0 F`;
			lows[i - 1].textContent = `Low: ${Math.floor(
				forecastData[i - 1].day.mintemp_f
			)}\u00B0 F`;
			highs[i - 1].textContent = `High: ${Math.floor(
				forecastData[i - 1].day.maxtemp_f
			)}\u00B0 F`;
		} else if (units == "met") {
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
}

// INIT PAGE WITH SEATTLE AS DEFAULT
getForecast("Seattle");
