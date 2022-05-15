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
                const response = await axios.get(`${this.root}${req.url}&apikey=${this.apikey}`);
                res.json(response.data.result);
            } catch (e) {
                res.status(e.status || e.error ? e.error.statusCode : 500).send({error:e})
            }
        });
        return router;
    }
    async coinTransactions(coin) {
        // RVT = 0x3d1ba9be9f66b8ee101911bc36d3fb562eac2244
        let block = 0;
        let data = await axios.get(`${this.root}?module=account&action=tokentx&startblock=${block}&contractaddress=${coin}`)
    }
}
module.exports = Etherscan;