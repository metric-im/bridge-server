import TokenTransactions from './processors/TokenTransactions.mjs';

const main = (async()=>{
    let process = new TokenTransactions();
    await process.run();
})();