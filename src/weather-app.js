const weatherApp = (parentElement) => {
    let currentWeatherInformation = null;
    const temperatureUnit = "celsius";

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

    const element = createBasicDiv(["weather-app-container"], parentElement);
    const temperature = createBasicDiv(["weather-app-temperature"], element);
    const country = createBasicDiv(["weather-app-country"], element);
    const city = createBasicDiv(["weather-app-city"], element);
    const region = createBasicDiv(["weather-app-region"], element);

    const requestNewLocation = async (location) => {
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

    const refreshDisplay = async () => {
        if (currentWeatherInformation) {
            try {
                switch (temperatureUnit) {
                    case "fahrenheit":
                        temperature.textContent = `${currentWeatherInformation.tempf}°F`;
                        break;
                    case "celsius":
                    default:
                        temperature.textContent = `${currentWeatherInformation.tempc}°C`;
                        break;
                }
                country.textContent = currentWeatherInformation.countryName;
                city.textContent = currentWeatherInformation.cityName;
                region.textContent = currentWeatherInformation.region;
            } catch (error) {
                console.log(`Weather app refresh error: ${error.message}`);
            }
        }
    };

    requestNewLocation("london");

    return element;
};
export default weatherApp;
