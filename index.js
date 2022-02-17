let fs = require('fs');

class Bridge {
    constructor(connector) {
        this.connector = connector;
    }
    routes() {
        let router = require('express').Router();
        let systems = fs.readdirSync(__dirname+'/systems');
        // set routes services
        for (let name of systems) {
            let comp = new (require(__dirname+'/systems/'+name))(this.connector);
            router.use("/bridge/"+comp.name,comp.routes());
        }
        return router;
    }
}
module.exports = Bridge;
