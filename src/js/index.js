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

/*Event Delegation (22:40 min) – attach event listener when element is not present when page is first loaded. Attach event listener to an element that is already present, then determine where the click happened and take action based on that*/
elements.searchResPages.addEventListener('click', e => {
	const btn = e.target.closest('.btn-inline');
	//console.log(btn);//e=click event, target=where it happened
	if (btn) {
		const goToPage = parseInt(btn.dataset.goto, 10);//specifiy using base-10 numbering system
		searchView.clearResults();
		searchView.renderResults(state.search.result, goToPage);
		//console.log(goToPage);
	}
});


