	//test that Webpack is configured properly
	/*import num from './test';
	const x = 23;
	console.log(`I imported ${num} from another module!! (This is from index.js! Variable x is ${x} - also from the index.js file`);*/

//Global app controller
import Search from './models/Search';

const search = new Search('pizza'); //object from Search.js
//console.log(search);
search.getResults();


