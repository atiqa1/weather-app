import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());

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

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const getSkyClass = () => {
    if (!weather || weather.error) return "sky";
    const temp = weather.main.temp;
    if (temp <= 10) return "sky cold";
    if (temp <= 25) return "sky moderate";
    return "sky warm";
  };

  return (
    <>
      <div className="scene">
        <div className={getSkyClass()}>
          <div className="cloud"></div>
          <div className="cloud"></div>
          <div className="cloud"></div>
          <div className="cloud"></div>
          <div className="cloud"></div>
          <div className="cloud"></div>

          <h1 className="website-name">The Weather Pulse</h1>
          <h2 className="main-heading">Know Your Forecast, Anytime, Anywhere.</h2>

          <div className="time-date-box">
            <p className="time">
              {currentTime.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
              })}
            </p>
            <p className="date">
              {currentTime.toLocaleDateString([], {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>

          <div className="search-container">
            <input
              type="search"
              placeholder="Discover your weather..."
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
              <div className="weather-box">
                {weather.error ? (
                  <p>❌ {weather.error}</p>
                ) : (
                  <>
                    <h3>Current Conditions in {weather.name}</h3>
                    <img
                      src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
                      alt={weather.weather[0].description}
                    />
                    <p>🌡 Temperature: {weather.main.temp}°C</p>
                    <p>☁ Condition: {weather.weather[0].description}</p>
                    <p>💨 Wind: {weather.wind.speed} m/s</p>
                  </>
                )}
              </div>
            ) : (
              <div className="weather-box">
                <p>🔍 Search a city to see the forecast</p>
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
