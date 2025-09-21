import React, { useState } from "react";
import "./App.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTemperatureHigh, faTemperatureLow, faTint, faWind, faCloud, faEye, faSun, faMoon } from '@fortawesome/free-solid-svg-icons';


function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);

  const API_KEY = process.env.REACT_APP_WEATHER_API_KEY;

  const handleSearch = async () => {
    if (!city.trim()) {
      setWeather(null);
      return;
    }

    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
      );
      const data = await response.json();

      if (data.cod === 200) {
        setWeather(data);
      } else {
        setWeather({ error: "City not found!" });
      }
    } catch (error) {
      console.error("Error fetching weather:", error);
      setWeather({ error: "Unable to fetch weather!" });
    }
  };

  // Sky background for scene
  const getSkyClass = () => {
    if (!weather || weather.error) return "sky";
    const temp = weather.main.temp;
    if (temp <= 10) return "sky cold";
    if (temp <= 25) return "sky moderate";
    return "sky warm";
  };

  // Weather-box background based on time & condition
  const getBoxClass = () => {
    if (!weather || weather.error) return "weather-box";

    const hour = new Date().getUTCHours() + weather.timezone / 3600;
    const isNight = hour < 6 || hour > 18;
    const condition = weather.weather[0].main.toLowerCase();

    if (isNight) return "weather-box night";
    if (condition.includes("rain") || condition.includes("storm")) return "weather-box rain";
    return "weather-box day";
  };

  const today = new Date();
  const date = today.toLocaleDateString([], {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const formatTime = (timestamp, timezone) => {
    return new Date((timestamp + timezone) * 1000).toUTCString().slice(-12, -4);
  };

  return (
    <>
      <div className="scene">
        <div className={getSkyClass()}>
          {/* Clouds */}
          {[...Array(12)].map((_, i) => (
            <div key={i} className="cloud"></div>
          ))}

          <h1 className="website-name">The Weather Pulse</h1>
          <h2 className="main-heading">Know Your Forecast, Anytime, Anywhere.</h2>

          {/* Date */}
          <div className="date-box">
            <p className="date">{date}</p>
          </div>

          <div className="search-container">
            <input
              type="search"
              placeholder="Search your location..."
              className="search-input"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
            <button onClick={handleSearch} className="search-button">
              Search
            </button>
          </div>

          <div className="results">
            {weather ? (
              <div className={getBoxClass()}>
                {weather.error ? (
                  <p>❌ {weather.error}</p>
                ) : (
                  <>
                    <h3>
                      {weather.name}, {weather.sys.country}
                    </h3>
                    <img
                      src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
                      alt={weather.weather[0].description}
                    />

                    <div className="weather-section">
                      <p><FontAwesomeIcon icon={faTemperatureHigh} /> Temperature: {weather.main.temp}°C</p>
                      <p><FontAwesomeIcon icon={faTemperatureLow} /> Feels like: {weather.main.feels_like}°C</p>
                      <p><FontAwesomeIcon icon={faTint} /> Humidity: {weather.main.humidity}%</p>
                      <p><FontAwesomeIcon icon={faWind} /> Wind: {weather.wind.speed} m/s</p>
                      <p><FontAwesomeIcon icon={faCloud} /> Clouds: {weather.clouds.all}%</p>
                      <p><FontAwesomeIcon icon={faEye} /> Visibility: {weather.visibility} m</p>
                      <p><FontAwesomeIcon icon={faSun} /> Sunrise: {formatTime(weather.sys.sunrise, weather.timezone)}</p>
                      <p><FontAwesomeIcon icon={faMoon} /> Sunset: {formatTime(weather.sys.sunset, weather.timezone)}</p>

                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="weather-box">
                <p>🌍 Check the weather in a city or country...</p>
              </div>
            )}
          </div>
        </div>

        <div className="ground"></div>
      </div>

      <footer className="footer">
        <p>© 2025 The Weather Pulse | Built by Atiqa Zahoor</p>
      </footer>
    </>
  );
}

export default App;
