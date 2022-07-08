import axios from 'axios';
const headers = {headers:{authorization:"bearer "+process.env.METRIC_KEY}};

export default class PopulateNFL {
    constructor(bridge) {
        this.bridge = bridge
        this.sd = this.bridge.modules.sportsdata;
        this.endpoint = "http://localhost:3000/ping/silent/nfloutcome";
        // this.endpoint = "https://metric.im/ping/silent/nfloutcome";
        this.headers = {headers:{authorization:"bearer "+process.env.METRIC_KEY}};
        this.origin = {ua:"sportsdata/1.0 (metric bridge)"};
    }
    async games(season,week) {
        if (week) {
            return await this.sd.get('nfl','scores',`/nfl/scores/json/ScoresByWeek/${season}/${week}`);
        } else {
            return await this.sd.get('nfl','scores',`/nfl/scores/json/Scores/${season}`);
        }
    }
    async playerProps(scoreId) {
        return await this.sd.get('nfl','odds',`/nfl/odds/json/BettingPlayerPropsByScoreID/${scoreId}`);
    }
    async bettingMarkets(scoreId) {
        return await this.sd.get('nfl','odds',`/nfl/odds/json/BettingMarketsByScoreID/${scoreId}`);
    }
    async sportsBooks() {
        return await this.sd.get('nfl','odds',`/nfl/odds/json/ActiveSportsbooks`);
    }
    async bettingResults() {
        return await this.sd.get('nfl','odds',`/nfl/odds/json/ActiveSportsbooks`);
    }
    async run() {
        try {
            console.log("started "+new Date());
            let games = await this.games("2021REG");
            let books = await this.sportsBooks();
            for (let game of games) {
                let outcomes = []
                if (!game.IsOver) continue;
                let record = this.parseObjectPrimitves(game);
                record.StadiumName = game.StadiumDetails.Name;
                record.StadiumCity = game.StadiumDetails.City;
                record.StadiumState = game.StadiumDetails.State;
                record.StadiumCapacity = game.StadiumDetails.Capacity;
                record.StadiumSurface = game.StadiumDetails.PlayingSurface;
                record.StadiumType = game.StadiumDetails.Type;
                record.latitude = game.StadiumDetails.GeoLat;
                record.longitude = game.StadiumDetails.GeoLong;
                record.GameName = `${game.AwayTeam}@${game.HomeTeam}`;
                let props = await this.playerProps(game.ScoreID);
                for (let prop of props) {
                    let propRecord = Object.assign({},record,this.parseObjectPrimitves(prop));
                    for (let outcome of prop.BettingOutcomes) {
                        let outcomeRecord = Object.assign({},propRecord,this.parseObjectPrimitves(outcome));
                        outcomeRecord.SportsBookName = outcome.SportsBook.Name;
                        outcomeRecord.SportsBookId = outcome.SportsBook.SportsbookID;
                        outcomeRecord._time = new Date(outcome.Created);
                        outcomes.push(outcomeRecord);
                    }
                }
                // game._markets = await this.bettingMarkets(game.ScoreID);
                console.log(`${record.Season}-${record.Week} ${record.GameName}`);
                await axios.put(this.endpoint,outcomes,this.headers);
            }
            return "done "+new Date();
        } catch(e) {
            console.error(e);
        }
    }
    parseObjectPrimitves(o) {
        return Object.entries(o).reduce((r,[key,val])=>{
            if (val === null || ['boolean','number','bigint','string'].includes(typeof val)) {
                r[key] = val;
            }
            return r;
        },{})
    }
}
