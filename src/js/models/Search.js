import axios from 'axios'; //fetch not supported in older browsers so will use axios. Axios also automatically returns Json.
import { key, proxy } from '../config';

export default class Search {
	constructor(query) {
		this.query = query;
	}

	async getResults() {
		try {
			//const res = await axios(`https://www.food2fork.com/api/search?key=${key}&q=${this.query}`) //q is coming from api specs
			const res = await axios(`${proxy}https://www.food2fork.com/api/search?key=${key}&q=${this.query}`)
			//console.log(res);
			this.result = res.data.recipes;
			//console.log(this.result);
		} catch (error) {
			alert(error);
		}	
	}
}
