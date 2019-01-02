import axios from 'axios'; //fetch not supported in older browsers so will use axios. Axios also automatically returns Json.

export default class Search {
	constructor(query) {
		this.query = query;
	}

	async getResults() {
	//const proxy = 'https://cors-anywhere.herokuapp.com/';
		const key = '41935e00cb1cce8120141e1d8734722f';
		try {
			const res = await axios(`https://www.food2fork.com/api/search?key=${key}&q=${this.query}`) //q is coming from api specs
			//const res = await axios(`${proxy}https://www.food2fork.com/api/search?key=${key}&q=${query}`)
			//console.log(res);
			this.result = res.data.recipes;
			//console.log(this.result);
		} catch (error) {
			alert(error);
		}	
	}
}
