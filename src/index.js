import "./styles.css";
import weatherApp from "./weather-app.js";
import weatherAppStyles from "./weather-app-styles-default.lazy.css";

const body = document.querySelector("body");
const newWeatherApp = weatherApp(body);

weatherAppStyles.use();
