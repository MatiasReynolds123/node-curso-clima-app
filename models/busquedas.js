const axios = require('axios');
const fs = require('fs');

class Busquedas {
    historial = [];

    dbPath = './db/database.json';

    constructor() {
        this.leerDB();
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

get historialCapitalizado() {
    //capitalizar cada palabra

    return this.historial.map( lugar => {

        let palabras = lugar.split( ' ');

        palabras = palabras.map( p => p[0].toUpperCase() + p.substring(1));

        return palabras.join(' ');
    });
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
    agregarHistorial( lugar = '') {
        if( this.historial.includes( lugar.toLowerCase() ) ) {
            return;
        }
        this.historial = this.historial.splice( 0, 5 );
        

        this.historial.unshift( lugar.toLowerCase() );

        //Grabar DB
        this.guardarDB();
    }

    guardarDB() {
        const payload = {
            historial: this.historial
        }

        fs.writeFileSync( this.dbPath, JSON.stringify( payload ) );
    }

    leerDB() {
        //Debe de existir
        if( !fs.existsSync( this.dbPath ) ) return;
        

        const info = fs.readFileSync( this.dbPath, { encoding: 'utf8' });
        
        const data = JSON.parse( info );

        this.historial = data.historial;

    }
}

module.exports = Busquedas;