const fs = require('fs');
class BridgeServer {
    constructor(connector) {
        this.connector = connector;
    }
    routes() {
        let router = require('express').Router();
        // set routes services
        let modules = fs.readdirSync(__dirname+'/modules');
        for (let module of modules) {
            let name = module.replace(/(\.mjs|\.js)$/,"");
            let comp = new (require('./modules/'+module))(this.connector)
            router.use('/bridge/'+name.toLowerCase(),comp.routes());
        }
        return router;
    }
}
module.exports = BridgeServer
