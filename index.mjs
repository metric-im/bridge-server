import fs from 'fs';
import express from 'express';
import path from "path";
import { fileURLToPath } from 'url';

export default class BridgeServer {
    constructor(connector) {
        this.connector = connector;
        this.modules = {};
        this.root = path.dirname(fileURLToPath(import.meta.url));
    }
    static async mint(connector) {
        let instance = new BridgeServer(connector);
        let modules = fs.readdirSync(instance.root+"/modules");
        for (let name of modules) {
            let module = await import(`${instance.root}/modules/${name}/index.mjs`);
            instance.modules[name.toLowerCase()] = new module.default(instance.connector);
        }
        return instance;
    }
    routes() {
        let router = express.Router();
        for (let name of Object.keys(this.modules)) {
            // let comp = new (await import('./modules/'+module))(this.connector);
            router.use('/bridge/'+name,this.modules[name].routes());
        }
        return router;
    }
}
