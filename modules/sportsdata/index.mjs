/**
 * Sportsdata bridge harness
 *
 * sportsdata.io is a source for real time sports statistics and information
 *
 */
import express from 'express';
import axios from 'axios';
export default class Sportsdata {
    constructor(connector) {
        this.connector = connector;
        this.root = 'https://fly.sportsdata.io/v3';
        try {
            this.creds = JSON.parse(connector.profile.SPORTSDATA_KEY)
        } catch(e) {
            this.creds = {leagues:{},base:{},projections:{},odds:{}}
        }
    }
    routes() {
        let router = express.Router();
        router.get('/:league/:dataset/*', async (req,res)=> {
            try {
                res.json(await this.get(req.params.league,req.params.dataset,req.url));
            } catch (e) {
                res.status(e.status || e.error ? e.error.statusCode : 500).send({error: e.message})
            }
        })
        return router;
    }
    async get(league,dataset,url) {
        let key = this.creds.base[league];
        if (dataset === 'projections') key = this.creds.projections[league];
        if (dataset === 'odds') key = this.creds.odds[league];
        const response = await axios.get(`${this.root}${url}`,{headers:{'Ocp-Apim-Subscription-Key':key}});
        return response.data;
    }
}
