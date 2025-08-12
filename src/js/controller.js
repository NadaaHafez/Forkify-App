import * as model from './model.js';
import recipeView from './views/recipeView.js'; // we're only importing the instances of the class
import searchView from './views/searchView.js'; // we're only importing the instances of the class
import resultsView from './views/resultsView.js'; // we're only importing the instances of the class
import paginationView from './views/paginationView.js';

import 'core-js/stable'; //polyfill everything else
import 'regenerator-runtime/runtime'; //for polyfill async/await

//hot module reloading, This is not a real js, it's coming from parcel
// if (module.hot) {
//   module.hot.accept();
// }

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);
    if (!id) return;

    recipeView.renderSpinner();

    //loading recipe
    await model.loadRecipe(id); // because loadRecipe() will return a promise so we need to await it (it's similar to async func calling another async func)

    //rendering recipe
    recipeView.render(model.state.recipe);
  } catch (err) {
    // alert(err);
    recipeView.renderError();
  }
};

const controlSearchResults = async function () {
  try {
    //GET search query
    const query = searchView.getQuery();
    if (!query) return;

    //render spinner
    resultsView.renderSpinner();

    //load Search Results
    await model.loadSearchResults(query);

    //render search results
    resultsView.render(model.getSearchResultsPage());

    //Render inital pagination button
    paginationView.render(model.state.search);
  } catch (err) {
    console.error(err);
  }
};

const controlPagination = function (goToPage) {
  // Render NEW RESULTS
  resultsView.render(model.getSearchResultsPage(goToPage));

  // Render NEW pagination button
  paginationView.render(model.state.search);
};

const controlServings = function (servings) {
  //Update the recipe servings
  model.updateServings(servings);

  //update the recipe views
  recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
};

const init = function () {
  recipeView.addHandlerRender(controlRecipes);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerPagination(controlPagination);
  recipeView.addHandlerUpdateServings(controlServings);
};

init();
