import axios from 'axios';
import express from 'express';
export default class Etherscan {
    constructor(connector) {
        this.apikey = connector.profile.ETHERSCAN_KEY;
        this.root = "https://api.etherscan.io/api";
    }
    routes() {
        let router = express.Router();
        router.get('/', async (req,res)=>{
            try {
                res.json(await this.get(req.url));
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
