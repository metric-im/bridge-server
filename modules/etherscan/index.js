const axios = require('axios');
class Etherscan {
    constructor() {
        this.apikey = process.env.ETHERSCAN_KEY;
        this.root = "https://api.etherscan.io/api";
    }
    routes() {
        let router = require('express').Router();
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
module.exports = Etherscan;