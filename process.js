let TokenTransactions = require('./processors/TokenTransactions');

const main = (async()=>{
    let process = new TokenTransactions();
    await process.run();
})();