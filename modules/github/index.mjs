import axios from 'axios';
import express from 'express';

export default class Github {
  constructor(connector) {
  }
  routes() {
    let router = express.Router();
    router.get('/custom/:org/list/repos', async (req,res)=> {
      try {
        let response = await axios.get(`https://api.github.com/orgs/${req.params.org}/repos?per_page=100`, {headers: {authorization: `bearer ${req.query.auth}`}});
        let summary = response.data.reduce((result,repo)=>{
          result += `git clone ${repo.ssh_url};\n`;
          return result;
        },"");
        res.send(summary);
      } catch (e) {
        console.log(e);
        res.status(500).send('error');
      }
    });
    router.get('/*', async (req,res)=>{
      try {
        let response = await axios.get(`https://api.github.com/${req.params[0]}`,{headers:{authorization:`bearer ${req.query.auth}`}});
        res.json(response.data);
      } catch (e) {
        console.log(e);
        res.status(500).send('error');
      }
    });
    return router;
  }
  async get(url) {
    const response = await axios.get(`${this.root}${url}&apikey=${this.apikey}`);
    return response.data.result;
  }
}

