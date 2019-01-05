	//test that Webpack is configured properly
	/*import num from './test';
	const x = 23;
	console.log(`I imported ${num} from another module!! (This is from index.js! Variable x is ${x} - also from the index.js file`);*/

//Global app controller
import Search from './models/Search';
import Recipe from './models/Recipe';
import * as searchView from './views/searchView';
import { elements, renderLoader, clearLoader } from './views/base';

//One Object to store Global State of app
	// Search Object
	//Current Recipe Object
	//Liked Recipes 

const state = {};

//SEARCH CONTROLLER
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

		try {
		//4. Search for recipes
		await state.search.getResults();

		//5. render results on UI (after receive results from api)
		//console.log(state.search.result);
		clearLoader();
		searchView.renderResults(state.search.result);
		} catch (err) {
			alert('Something went wrong with the search...')
			clearLoader();
		}
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


//RECIPE CONTROLLER
	//for testing
	/*const r = new Recipe(46956)
	r.getRecipe();
	console.log(r);*/

const controlRecipe = async () => {
	//Get ID from url
	const id = window.location.hash.replace('#', ''); //location=entire url
	console.log(id);

	if (id) {
		//Prepare UI for changes

		//Create new recipe object
		state.recipe = new Recipe(id);

		try {
		//Get recipe data
		await state.recipe.getRecipe();

		//Calculate servings and time
		state.recipe.calcTime();
		state.recipe.calcServings();

		//Render recipe
		console.log(state.recipe);
		} catch (err) {
			alert(`Error processing recipe.`)
		}
	}
};

/*window.addEventListener('hashchange', controlRecipe);
window.addEventListener('load', controlRecipe); //will load recipe on page load. Useful if user has bookmarked page (otherwise will only load recipe on hashChange)*/

//eventlisteners, above, call the same function. Put events into an array
['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));