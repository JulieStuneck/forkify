	//test that Webpack is configured properly
	/*import num from './test';
	const x = 23;
	console.log(`I imported ${num} from another module!! (This is from index.js! Variable x is ${x} - also from the index.js file`);*/

//Global app controller
import Search from './models/Search';
import * as searchView from './views/searchView';
import { elements, renderLoader, clearLoader } from './views/base';

//One Object to store Global State of app
// Search Object
//Current Recipe Object
//Liked Recipes 

const state = {};

const controlSearch = async () => {
	//1. get query from view
	const query = searchView.getInput();
	//console.log(query);

	if (query) {
		//2. New Search object and add it to state
		state.search = new Search(query);

		//3. Prepare UI for reslults (clear previous results, load spinner)
		searchView.clearInput();
		searchView.clearResults();
		renderLoader(elements.searchRes);

		//4. Search for recipes
		await state.search.getResults();

		//5. render results on UI (after receive results from api)
		//console.log(state.search.result);
		clearLoader();
		searchView.renderResults(state.search.result);
	}
}

elements.searchForm.addEventListener('submit', e => {
	e.preventDefault(); //prevent page reloading when click search button
	controlSearch();
});




