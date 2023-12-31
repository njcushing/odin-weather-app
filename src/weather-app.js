const weatherApp = () => {
    let currentWeatherInformation = null;
    let temperatureUnit = "celsius";
    let windSpeedUnit = "mph";
    let precipitationUnit = "mm";

    const createBasicDiv = (
        classes = [],
        parent = null,
        id = "",
        textContent = ""
    ) => {
        const newElement = document.createElement("div");
        classes.forEach((className) => {
            if (typeof className === "string" && className.length > 0) {
                newElement.classList.add(className);
            }
        });
        if (typeof id === "string" && id.length > 0) {
            newElement.setAttribute("id", id);
        }
        if (typeof textContent === "string" && textContent.length > 0) {
            newElement.textContent = textContent;
        }
        try {
            if (parent) parent.appendChild(newElement);
        } catch (error) {
            console.log(error);
        }
        return newElement;
    };

    const element = createBasicDiv(["weather-app-container"]);

    const infoButtons = createBasicDiv(["weather-app-info-buttons"], element);
    const temperatureButton = document.createElement("button");
    temperatureButton.classList.add("weather-app-temperature-button");
    temperatureButton.addEventListener("click", () => {
        if (temperatureUnit === "celsius") temperatureUnit = "fahrenheit";
        else temperatureUnit = "celsius";
        refreshDisplay();
    });
    infoButtons.appendChild(temperatureButton);
    const windSpeedButton = document.createElement("button");
    windSpeedButton.classList.add("weather-app-wind-speed-button");
    windSpeedButton.addEventListener("click", () => {
        if (windSpeedUnit === "kph") windSpeedUnit = "mph";
        else windSpeedUnit = "kph";
        refreshDisplay();
    });
    infoButtons.appendChild(windSpeedButton);
    const precipitationButton = document.createElement("button");
    precipitationButton.classList.add("weather-app-precipitation-button");
    precipitationButton.addEventListener("click", () => {
        if (precipitationUnit === "mm") precipitationUnit = "in";
        else precipitationUnit = "mm";
        refreshDisplay();
    });
    infoButtons.appendChild(precipitationButton);

    const info = createBasicDiv(["weather-app-info-container"], element);
    const temperature = createBasicDiv(["weather-app-temperature"], info);
    const weatherIcon = document.createElement("img");
    weatherIcon.classList.add("weather-app-icon");
    info.appendChild(weatherIcon);
    const condition = createBasicDiv(["weather-app-condition"], info);
    const city = createBasicDiv(["weather-app-city"], info);
    const region = createBasicDiv(["weather-app-region"], info);
    const country = createBasicDiv(["weather-app-country"], info);
    const windDir = createBasicDiv(["weather-app-wind-direction"], info);
    const windSpd = createBasicDiv(["weather-app-wind-speed"], info);
    const humidity = createBasicDiv(["weather-app-humidity"], info);
    const precipitation = createBasicDiv(["weather-app-precipitation"], info);
    const lastUpdated = createBasicDiv(["weather-app-last-updated"], info);

    const requestNewLocation = async (location) => {
        info.classList.add("loading");
        try {
            const getWeatherAPIKey = await getAPIKey();
            const weatherResponse = await fetch(
                `https://api.weatherapi.com/v1/current.json?key=${getWeatherAPIKey}&q=${location}`,
                { mode: "cors" }
            );
            if (!weatherResponse.ok) {
                throw new Error("Weather response is not ok.");
            }
            const weatherJSON = await weatherResponse.json();
            currentWeatherInformation =
                getRelevantWeatherInformationFromJSON(weatherJSON);
            refreshDisplay();
        } catch (error) {
            console.log(`Error! ${error.message}`);
        }
        info.classList.remove("loading");
    };

    const getRelevantWeatherInformationFromJSON = (weatherJSON) => ({
        countryName: weatherJSON.location.country,
        cityName: weatherJSON.location.name,
        region: weatherJSON.location.region,
        localTime: weatherJSON.location.localtime,
        tempc: weatherJSON.current.temp_c,
        tempf: weatherJSON.current.temp_f,
        humidity: weatherJSON.current.humidity,
        windDeg: weatherJSON.current.wind_degree,
        windDir: weatherJSON.current.wind_dir,
        windSpeedMph: weatherJSON.current.wind_mph,
        windSpeedKph: weatherJSON.current.wind_kph,
        precipInch: weatherJSON.current.precip_in,
        precipMm: weatherJSON.current.precip_mm,
        conditionText: weatherJSON.current.condition.text,
        conditionIcon: weatherJSON.current.condition.icon,
        lastUpdated: weatherJSON.current.last_updated,
    });

    const getAPIKey = () => "defd47dda70843cfaa084416232506";

    const searchBar = createBasicDiv(["weather-app-search-bar"]);
    const searchBarInput = document.createElement("input");
    const searchBarButton = document.createElement("button");
    searchBarInput.classList.add("weather-app-search-bar-input");
    searchBarButton.classList.add("weather-app-search-bar-button");
    searchBarButton.classList.add("material-symbols-rounded");
    searchBarButton.textContent = "Search";
    searchBarButton.addEventListener("click", () => {
        requestNewLocation(searchBarInput.value);
    });
    searchBar.appendChild(searchBarInput);
    searchBar.appendChild(searchBarButton);
    element.appendChild(searchBar);

    const refreshDisplay = async () => {
        if (currentWeatherInformation) {
            info.classList.add("loading");
            try {
                if (temperatureUnit === "celsius") {
                    temperatureButton.textContent = "°C";
                    temperature.textContent = `${currentWeatherInformation.tempc}°C`;
                } else {
                    temperatureButton.textContent = "°F";
                    temperature.textContent = `${currentWeatherInformation.tempf}°f`;
                }
                weatherIcon.src = await currentWeatherInformation.conditionIcon;
                condition.textContent = currentWeatherInformation.conditionText;
                city.textContent = currentWeatherInformation.cityName;
                region.textContent = currentWeatherInformation.region;
                country.textContent = currentWeatherInformation.countryName;
                windDir.textContent = `Wind Direction: ${currentWeatherInformation.windDeg}° (${currentWeatherInformation.windDir})`;
                if (windSpeedUnit === "mph") {
                    windSpeedButton.textContent = "mph";
                    windSpd.textContent = `Wind Speed: ${currentWeatherInformation.windSpeedMph} miles per hour`;
                } else {
                    windSpeedButton.textContent = "kph";
                    windSpd.textContent = `Wind Speed: ${currentWeatherInformation.windSpeedKph} kilometres per hour`;
                }
                humidity.textContent = `Humidity: ${currentWeatherInformation.humidity}%`;
                if (precipitationUnit === "mm") {
                    precipitationButton.textContent = "mm";
                    precipitation.textContent = `Precipitation: ${currentWeatherInformation.precipMm} millimetres`;
                } else {
                    precipitationButton.textContent = "in";
                    precipitation.textContent = `Precipitation: ${currentWeatherInformation.precipInch} inches`;
                }
                lastUpdated.textContent = `Last Updated: ${currentWeatherInformation.lastUpdated}`;
            } catch (error) {
                console.log(`Weather app refresh error: ${error.message}`);
            }
            info.classList.remove("loading");
        }
    };

    requestNewLocation("london");

    return element;
};
export default weatherApp;
