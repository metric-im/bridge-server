import axios from 'axios';
const headers = {headers:{authorization:"bearer "+process.env.METRIC_KEY}};

export default class TokenTransactions {
    constructor(bridge) {
        this.bridge = bridge;
        this.etherscan = this.bridge.modules.etherscan;
    }
    async traunch(token,block=0) {
        let data = await this.etherscan.get(`?module=account&action=tokentx&startblock=${block}&contractaddress=${token}`);
        let records = [];
        for (let txn of data) {
            let record = {};
            try {
                let divisor = BigInt(Math.pow(10,Number(txn.tokenDecimal)));
                record.block_number = Number(txn.blockNumber);
                record._time = new Date(Number(txn.timeStamp)*1000);
                record._source = "etherscan"
                record.hash = txn.hash;
                record.nonce = txn.nonce;
                record.block_hash = txn.blockHash;
                record.from = txn.from;
                record.contract = txn.contractAddress;
                record.to = txn.to;
                record.value = parseFloat(BigInt(txn.value||0)/divisor);
                record.system_value = txn.value;
                record.token_name = txn.tokenName;
                record.token_symbol = txn.tokenSymbol;
                record.token_decimal = Number(txn.tokenDecimal);
                record.transaction_index = Number(txn.transactionIndex);
                record.gas = Number(txn.gas);
                record.gas_price = Number(txn.gasPrice);
                record.gas_used = Number(txn.gasUsed);
                record.cumulative_gas_used = Number(txn.cumulativeGasUsed);
                record.confirmations = Number(txn.confirmations);
            } catch(e) {
                console.warn(txn.block_number+": "+e);
                record._ERROR = e.message;
            }
            records.push(record);
        }
        await axios.put('http://localhost:3000/ping/silent/tokentxn',records,headers)
        return records;
    }
    async run() {
        try {
            let tokens = process.argv[2].split(',');
            let count = 0;
            let block = 0;
            for (let token of tokens) {
                let records = await this.traunch(token,block);
                count = count + records.length;
                while (records.length === 10000) {
                    records = await this.traunch(token,records[records.length-1].block_number+1);
                }
                console.log(`wrote ${count} records`);
            }
        } catch(e) {
            console.error(e);
        }
    }
}
// RVT = 0x3d1ba9be9f66b8ee101911bc36d3fb562eac2244
