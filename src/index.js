import "./styles.css";

const APIKey = "defd47dda70843cfaa084416232506";

const getWeather = async (location) => {
    try {
        const weatherResponse = await fetch(
            `https://api.weatherapi.com/v1/current.json?key=${APIKey}&q=${location}`,
            { mode: "cors" }
        );
        if (!weatherResponse.ok) throw new Error("Weather response is not ok.");
        const weatherJSON = await weatherResponse.json();
        return getRelevantWeatherInformationFromJSON(weatherJSON);
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

getWeather("london");
