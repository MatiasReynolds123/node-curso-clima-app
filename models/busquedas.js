const axios = require('axios');

class Busquedas {
    historial = ['Rio Cuarto', 'Córdoba', 'Buenos Aires'];

    constructor() {
        //TODO: leer DB si existe
    }

get paramsMapbox() {
    return {
        'access_token': process.env.MAPBOX_KEY,
        'limit': 5,
        'language': 'es',
     }
}

get paramsOpenWeather() {
    return {
        'appid': process.env.OPENWEATHER_KEY,
        'units': 'metric',
        'lang' : 'es'
    }
}

    async ciudad( lugar = '') {
        //peticion http

        try {

            const instance = axios.create({
                baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${ lugar }.json`,
                params: this.paramsMapbox
            })

            const resp = await instance.get();
            
            return resp.data.features.map( lugar => ({// para devolver implicitamente un objeto
                id: lugar.id,
                nombre: lugar.place_name,
                lng: lugar.center[0],
                lat: lugar.center[1]
            })); //return lugares que coincidan con lugar que escriban en funcion
        } catch (err) {
            return [];
        };
        
        
    }

    async climaLugar( lat, lon ) {
        try {
            const instance = axios.create({
                baseURL: "https://api.openweathermap.org/data/2.5/weather",
                params: {... this.paramsOpenWeather, lat, lon}
            })

            const resp = await instance.get();

            const { weather, main } = resp.data;
            return {
                desc: weather[0].description,
                temp: main.temp,
                min: main.temp_min,
                max: main.temp_max

            }
        } catch (err) {
            console.log(err);
        }
    }
}

module.exports = Busquedas;