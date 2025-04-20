const express = require('express');
const weatherService = require('../services/weatherService');
const router = express.Router();

router.get('/:cityName', async function (req, res, next) {
    const cityName = req.params.cityName
    res.send(await weatherService.getCurrentWeatherByCity(cityName));
});

router.get('/forecast/:cityName', async function (req, res, next) {
    const cityName = req.params.cityName
    res.send(await weatherService.getForecastWeatherByCity(cityName));
});


module.exports = router;
