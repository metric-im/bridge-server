import express from 'express';
export default class Datorama {
    constructor(connector) {
        // this.apikey = connector.profile.DATORAMA_KEY;
        this.root = "https://platform.datorama.com/external/dashboard";
    }
    routes() {
        let router = express.Router();
        router.get('/*', async (req,res)=>{
            try {
                let response = await this.get(req.url);
                res.json(response);
            } catch (e) {
                res.status(e.status || e.error ? e.error.statusCode : 500).send({error:e})
            }
        });
        return router;
    }
    async get(url) {
        const response = await fetch(`${this.root}${url}`);
        return response.data.result;
    }
}
