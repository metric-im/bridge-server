/**
 * Etherscan bridge harness
 *
 * Etherscan.io is a popular service for querying the Ethereum blockchain. There
 * is no authentication required for basic fetch requests.
 */

class Etherscan {
    constructor(connector) {
        this.connector = connector;
        this.root = 'https://api.etherscan.io/api';
        this.name = "etherscan";
    }
    routes() {
        let fetch = require('node-fetch');
        let express = require('express');
        const router = express.Router();
        router.get('/', async (req,res)=>{
            try {
                const response = await fetch(`${this.root}${req.url}`);
                let data = await response.json();
                res.json(data)
            } catch (e) {
                res.status(e.status || e.error ? e.error.statusCode : 500).send({error:e})
            }
        });
        return router;
    }
}

module.exports = Etherscan;
