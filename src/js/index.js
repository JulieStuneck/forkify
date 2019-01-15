	//test that Webpack is configured properly
	/*import num from './test';
	const x = 23;
	console.log(`I imported ${num} from another module!! (This is from index.js! Variable x is ${x} - also from the index.js file`);*/

//Global app controller
import Search from './models/Search';
import Recipe from './models/Recipe';
import List from './models/List';
import Likes from './models/Likes';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import * as listView from './views/listView';
import * as likesView from './views/likesView';
import { elements, renderLoader, clearLoader } from './views/base';

//One Object to store Global State of app
	// Search Object
	//Current Recipe Object
	//Liked Recipes 

const state = {};
//window.state = state; //testing

//SEARCH CONTROLLER
const controlSearch = async () => {
	//1. get query from view
	const query = searchView.getInput();//actual desired code

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
	e.preventDefault();
	controlSearch();
});


/*Event Delegation – attach event listener when element is not present when page is first loaded. Attach event listener to an element that is already present, then determine where the click happened and take action based on that*/
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
	//for testing:
		/*const r = new Recipe(46956)
		r.getRecipe();
		console.log(r);*/

const controlRecipe = async () => {
	//Get ID from url
	const id = window.location.hash.replace('#', ''); //location=entire url

	if (id) {
		//Prepare UI for changes
		recipeView.clearRecipe();
		renderLoader(elements.recipe);

		//Highlight the selected search item
		if (state.search) searchView.highlightSelected(id);

		//Create new recipe object
		state.recipe = new Recipe(id);

		try {
		//Get recipe data and parse ingredients
		await state.recipe.getRecipe();
		//console.log(state.recipe.ingredients);
		state.recipe.parseIngredients();

		//Calculate servings and time
		state.recipe.calcTime();
		state.recipe.calcServings();

		//Render recipe
		clearLoader();
		recipeView.renderRecipe(
			state.recipe,
			state.likes.isLiked(id)//will return true or false for render function likesView.js
			);
		
		} catch (err) {
			alert(`Error processing recipe.`)
		}
	}
};

/*window.addEventListener('hashchange', controlRecipe);
window.addEventListener('load', controlRecipe); //will load recipe on page load. Useful if user has bookmarked page (otherwise will only load recipe on hashChange)*/

//eventlisteners, above, call the same function. Put events into an array
['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));



//LIST CONTROLLER

const controlList = () => {
    // Create a new list IF there in none yet
    if (!state.list) state.list = new List();

    // Add each ingredient to the list and UI
    state.recipe.ingredients.forEach(el => {
        const item = state.list.addItem(el.count, el.unit, el.ingredient);
        listView.renderItem(item);
    });
}


//Handle delete and update list item events
elements.shopping.addEventListener('click', e => {
	const id = e.target.closest('.shopping__item').dataset.itemid;

	//Hande delete button
	if(e.target.matches('.shopping__delete, .shopping__delete *')) {
		//Delete from state
		state.list.deleteItem(id);

		//Delete from UI
		listView.deleteItem(id);

		//Handle the count update
	} else if (e.target.matches('.shopping__count-value')) {
		//read current value of element that was clicked (quantity of ingredient), then turn into number 
		if (state.list.count > 1) { //I added this if statement so could not decrement count below 0 - this is not working, come back to it
		const val = parseFloat(e.target.value, 10);
		state.list.updateCount(id, val);
		}
	}
})


//LIKE CONTROLLER
	/*//temporary, for testing render before have coded the ability to save state
	state.likes = new Likes();
	likesView.toggleLikeMenu(state.likes.getNumberLikes());*/
const controlLike = () => {
	if (!state.likes) state.likes = new Likes();
	const currentID = state.recipe.id;

	//user has NOT yet liked current recipe
	if (!state.likes.isLiked(currentID)) {
		//Add like to the state
		const newLike = state.likes.addLike(
			currentID,
			state.recipe.title,
			state.recipe.author,
			state.recipe.img
			);
		//Toggle the like button
		likesView.toggleLikeBtn(true);

		//Add like to UI list
		likesView.renderLike(newLike);
		//console.log(state.likes);

	//user HAS liked current recipe
	} else {
		//Remove like to the state
		state.likes.deleteLike(currentID);

		//Toggle the like button
		likesView.toggleLikeBtn(false);

		//Remove like from UI list
		likesView.deleteLike(currentID);
		//console.log(state.likes);
	}
	likesView.toggleLikeMenu(state.likes.getNumberLikes());
};

//Restore Liked recipies upon page load
window.addEventListener('load', () => {
	state.likes = new Likes();

	//Restore likes
	state.likes.readStorage();

	//Toggle like menu button
	likesView.toggleLikeMenu(state.likes.getNumberLikes());

	//Render the existing likes in like menue
	state.likes.likes.forEach(like => likesView.renderLike(like));
});



//Handling recipe button clicks
	//need event delgation, because none of these are loaded with page
//test what was clicked, then react accordingly
elements.recipe.addEventListener('click', e => {
	if (e.target.matches('.btn-decrease, .btn-decrease *')) {
		//* includes and child element
		// Decrease button is clicked
		if (state.recipe.servings > 1) {
		state.recipe.updateServings('dec');
		recipeView.updateServingsIngredients(state.recipe);
		}
	} else if (e.target.matches('.btn-increase, .btn-increase *')) {
		// Increase button is clicked
		state.recipe.updateServings('inc');
		recipeView.updateServingsIngredients(state.recipe);
	} else if (e.target.matches('.recipe__btn--add, .recipe__btn--add *')) {
		//Add ingredients to the shopping list
		controlList();
	} else if (e.target.matches('.recipe__love, .recipe__love *')) {
		//Like controller
		controlLike();
	}
});
