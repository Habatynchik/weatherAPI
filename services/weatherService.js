require('dotenv').config('../.env');
const axios = require('axios');

const OPEN_WEATHER_API_KEY = process.env.OPEN_WEATHER_API_KEY;

const weatherService = {
    getCurrentWeatherByCity: async (cityName) => {
        try {
            const response = await axios.get("https://api.openweathermap.org/data/2.5/weather", {
                params: {
                    appid: OPEN_WEATHER_API_KEY,
                    q: cityName,
                    units: 'metric'
                }
            })
            return {
                weather: response.data,
                error: null
            };
        } catch (error) {
            return {
                weather: null,
                error: "City is missing"
            };
        }

    },
    getForecastWeatherByCity: async (cityName) => {
        try {
            const response = await axios.get("https://api.openweathermap.org/data/2.5/forecast", {
                params: {
                    appid: OPEN_WEATHER_API_KEY,
                    q: cityName,
                    units: 'metric'
                }
            })
            return {
                weather: response.data,
                error: null
            };
        } catch (error) {
            return {
                weather: null,
                error: "City is missing"
            };
        }
    }
}

module.exports = weatherService;