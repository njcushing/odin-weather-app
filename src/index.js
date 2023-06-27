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
        return weatherJSON;
    } catch (error) {
        console.log(`Error! ${error.message}`);
    }
};

getWeather("london");
