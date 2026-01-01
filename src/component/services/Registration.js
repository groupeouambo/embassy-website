// Registration.js

import React, { useEffect, useState } from 'react';
import './registration.css';

const Registration = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const sampleWeather = {
      main: { temp: 26 },
      wind: { speed: 3 },
    };
    setWeatherData(sampleWeather);
    setLoading(false);
  }, []);

  return (
    <div className="registration-container">
      <section className="registration-form">
        <h1>Registration of Central African Republic Nationals (USA, Mexico, and Canada)</h1>

        <form>
          <label>
            Name *
            <div className="name-fields">
              <input type="text" placeholder="First" required />
              <input type="text" placeholder="Last" required />
            </div>
          </label>

          <label>
            Address *
            <input type="text" placeholder="Street Address" required />
            <input type="text" placeholder="Address Line 2" />
            <input type="text" placeholder="City" required />
            <input type="text" placeholder="State / Province / Region" required />
            <input type="text" placeholder="Postal / Zip Code" required />
          </label>

          <label>
            Profession *
            <input type="text" required />
          </label>

          <label>
            Next of Kin *
            <input type="text" required />
          </label>

          <label>
            Next of Kin Telephone and/or Email *
            <input type="text" required />
          </label>

          <label>
            Country
            <select required>
              <option value="">Select Country</option>
              <option value="USA">USA</option>
              <option value="Mexico">Mexico</option>
              <option value="Canada">Canada</option>
              {/* Add other country options as needed */}
            </select>
          </label>

          <label>
            Email *
            <input type="email" required />
          </label>

          <label>
            Phone Number *
            <input type="tel" required />
          </label>

          <button type="submit">Submit</button>
        </form>
      </section>

      <div id="lsvr_pressville_weather-1" className="widget lsvr-pressville-weather-widget">
        <div className="widget__inner">
          <h3 className="widget__title"><span>Weather</span></h3>
          <div className="widget__content">
            <div className="lsvr-pressville-weather-widget__time">
              <h4 className="lsvr-pressville-weather-widget__time-title">Local Time</h4>
              <p className="lsvr-pressville-weather-widget__time-value" data-timezone="America/New_York">
                {new Date().toLocaleTimeString()}
              </p>
            </div>
            {loading ? (
              <p>Loading weather...</p>
            ) : weatherData ? (
              <div className="lsvr-pressville-weather-widget__weather">
                <ul className="lsvr-pressville-weather-widget__weather-list">
                  {/* Current weather */}
                  <li className="lsvr-pressville-weather-widget__weather-item lsvr-pressville-weather-widget__weather-item--current">
                    <div className="lsvr-pressville-weather-widget__weather-item-labels">
                      <h4 className="lsvr-pressville-weather-widget__weather-item-title">Today</h4>
                      <p className="lsvr-pressville-weather-widget__weather-item-date">
                        {new Date().toLocaleDateString()}
                      </p>
                    </div>
                    <div className="lsvr-pressville-weather-widget__weather-item-values">
                      <span className="lsvr-pressville-weather-widget__weather-item-icon icon-cloud-fog" aria-hidden="true"></span>
                      <div className="lsvr-pressville-weather-widget__weather-item-temperature" title="Temperature">
                        {weatherData.main.temp} C
                      </div>
                      <div className="lsvr-pressville-weather-widget__weather-item-wind" title="Wind speed">
                        {weatherData.wind.speed} m/s
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
            ) : (
              <p>Could not fetch weather data</p>
            )}
            <div className="lsvr-pressville-weather-widget__text">
              <p><em>Weather data by <strong><a href="http://openweathermap.org" target="_blank" rel="noopener noreferrer">OpenWeatherMap.org</a></strong></em></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Registration;
