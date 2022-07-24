/**
 * Weather bridge
 *
 */
import express from 'express';
import axios from 'axios';
export default class Weather {
    constructor(connector) {
        this.connector = connector;
        this.root = "https://api.openweathermap.org/data/2.5/weather";
        this.key = this.connector.profile.OPENWEATHER_KEY;
    }
    routes() {
        let router = express.Router();
        router.get('/*', async (req,res)=> {
            try {
                let location = req.params[0].split(',');
                let result = await this.get(location[0],location[1],req.query.units)
                res.json(result);
            } catch (e) {
                res.status(e.status || e.error ? e.error.statusCode : 500).send({error: e.message})
            }
        })
        return router;
    }
    async get(longitude,latitude,units='metric') {
        let url = `${this.root}?lon=${longitude}&lat=${latitude}&appid=${this.key}&units=${units}`;
        let result = await axios.get(url);
        let event = {};
        if (result && result.data.weather && result.data.weather.length>0) {
            event.weather = result.data.weather[0].main;
            event.weatherDescription = result.data.weather[0].description;
            event.temperature = result.data.main.temp;
            event.humidity = result.data.main.humidity;
            event.barometer = result.data.main.pressure;
            event.wind_speed = result.data.wind.speed;
            event.wind_direction = result.data.wind.deg;
            event.wind_gust = result.data.wind.gust;
            event.weather_visibility = result.data.visibility;
        }
        return event;
    }
}
