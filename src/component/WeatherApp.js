import React, { useState, useEffect } from 'react';
import './WeatherApp.css';

const WeatherApp = () => {
  const [searchInput, setSearchInput] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [openCageData, setOpenCageData] = useState(null);
  const [mapSrc, setMapSrc] = useState('');
  const [opencageDetails, setOpencageDetails] = useState([]);
  const [showWeatherDetails, setShowWeatherDetails] = useState(false);

  const weatherUrl = 'https://api.openweathermap.org/data/2.5/weather?units=metric&q=';
  const openCageUrl = 'https://api.opencagedata.com/geocode/v1/json?';
  const apiKey = 'ffbff0b9d84caeb5bc9332194e5042be';
  const openCageApiKey = '75be0377f26443b0a0632ad01b9f9d2e';

  useEffect(() => {
    if (weatherData && openCageData) {
      const firstResult = openCageData.results[0];
      const latitude = firstResult.geometry.lat;
      const longitude = firstResult.geometry.lng;

      setMapSrc(
        `https://www.openstreetmap.org/export/embed.html?bbox=${longitude-0.1}%2C${latitude-0.1}%2C${longitude+0.1}%2C${latitude+0.1}&layer=mapnik`
      );

      setOpencageDetails([
        <li key="country"><strong>Country:</strong> {firstResult.components.country}</li>,
        <li key="country-code"><strong>Country Code:</strong> {firstResult.components.country_code}</li>,
        <li key="state"><strong>State:</strong> {firstResult.components.state}</li>,
        <li key="city"><strong>City:</strong> {firstResult.components.state_district}</li>,
        <li key="continent"><strong>Continent:</strong> {firstResult.components.continent}</li>,
        <li key="currency"><strong>Currency:</strong> {firstResult.annotations.currency.name} ({firstResult.annotations.currency.iso_code})</li>,
        <li key="flag"><strong>Flag:</strong> {firstResult.annotations.flag}</li>,
      ]);
    }
  }, [weatherData, openCageData]);
  console.log(weatherData);
  const main = async (city) => {
    try {
      const weatherResponse = await fetch(`${weatherUrl}${city}&appid=${apiKey}`);
      const weatherData = await weatherResponse.json();

      const openCageResponse = await fetch(`${openCageUrl}q=${city}&key=${openCageApiKey}`);
      const openCageData = await openCageResponse.json();

      setWeatherData(weatherData);
      setOpenCageData(openCageData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      main(searchInput);
    }
  };

  const handleClick = () => {
    main(searchInput);
    setShowWeatherDetails(true);
  };

  return (
    <div className='card'>
      <div className="search">
            <input
        type="text"
        placeholder="Enter city name"
        spellCheck="false"
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
        onKeyPress={handleKeyPress}
      />

        <button onClick={handleClick}>
          <img src="/images/search.png" alt="search" />
        </button>
      </div>
      {weatherData && openCageData && (
        <div className={`weather ${showWeatherDetails ? 'visible' : ''}`}>
          <img
            src={`images/${weatherData.weather[0].main.toLowerCase()}.png`}
            alt={weatherData.weather[0].main}
            className="weather-icon"
          />
          <h1 className="temp">{parseInt(weatherData.main.temp)}°C</h1>
          <h2 className="city">{weatherData.name}</h2>
          <div className="details">
            <div className="col">
              <img src="images/humidity.png" alt="humidity" />
              <p className="humidity">{weatherData.main.humidity}%</p>
            </div>
            <div className="col">
              <img src="./images/wind.png" alt="wind" />
              <p className="wind">{weatherData.wind.speed} Km/hr</p>
              <p>Wind Speed</p>
            </div>
          </div>
          <div className="map">
            <iframe
              id="mapFrame"
              title="Map"
              width="100%"
              height="300"
              frameBorder="0"
              style={{ border: 0 }}
              allowFullScreen
              src={mapSrc}
            ></iframe>
          </div>
          <div className="opencage-details">
            <h3>City Details</h3>
            <ul>{opencageDetails}</ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default WeatherApp;
