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
}

module.exports = Busquedas;