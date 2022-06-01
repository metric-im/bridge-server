/**
 * Interface to google maps api
 *
 * https://googlemaps.github.io/google-maps-services-js/
 */
import axios from 'axios';
import express from 'express';
import {Client} from "@googlemaps/google-maps-services-js";

export default class gmaps {
    constructor(connector) {
        this.apikey = connector.profile.GOOGLE_API_KEY;
        this.root = "https://maps.googleapis.com/maps/api/";
    }
    routes() {
        let router = express.Router();
        router.get('/*', async (req,res)=>{
            try {
                let url = req.url.replace(/^\/([A-Za-z]+)/,"$1/json");
                url = this.root+url+'?'+req.query+"&key="+this.apikey;
                let result = await axios.get(url);
                res.json(result.data)
                // const client = new Client({});
                //
                // client
                //     .elevation({
                //         params: {
                //             locations: [{ lat: 45, lng: -110 }],
                //             key: this.apikey
                //         },
                //         timeout: 1000 // milliseconds
                //     }, axios)
                //     .then(r => {
                //         console.log(r.data.results[0].elevation);
                //         res.json(r.data.results[0].elevation);
                //     })
                //     .catch(e => {
                //         console.log(e);
                //         res.send('maps error: '+e.message);
                //     });
            } catch (e) {
                res.status(e.status || e.error ? e.error.statusCode : 500).send({error:e})
            }
        });
        return router;
    }
    async get(url) {
        const response = await axios.get(`${this.root}${url}&apikey=${this.apikey}`);
        return response.data.result;
    }
}
