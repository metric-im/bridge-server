import axios from 'axios';
const headers = {headers:{authorization:"bearer "+process.env.METRIC_KEY}};

export default class PopulateNFL {
    constructor(bridge) {
        this.bridge = bridge
        this.sd = this.bridge.modules.sportsdata;
    }
    async weeklyGames(season,week) {
        return await this.sd.get('nfl','scores',`/nfl/scores/json/ScoresByWeek/${season}/${week}`);
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
            let games = await this.weeklyGames("2021REG",1);
            let books = await this.sportsBooks();
            for (let game of games) {
                game._props = await this.playerProps(game.ScoreID);
                game._markets = await this.bettingMarkets(game.ScoreID);
            }

            return games;
        } catch(e) {
            console.error(e);
        }
    }
}
