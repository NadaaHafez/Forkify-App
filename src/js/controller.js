import * as model from './model.js';
import recipeView from './views/recipeView.js'; // we're only importing the instances of the class
import searchView from './views/searchView.js'; // we're only importing the instances of the class
import resultsView from './views/resultsView.js'; // we're only importing the instances of the class
import paginationView from './views/paginationView.js';
import bookmarkView from './views/bookmarkView.js';

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

    //0) Update results view to mark the selected search results
    resultsView.update(model.getSearchResultsPage());

    //1) update bookmarks
    bookmarkView.update(model.state.bookmarks);

    //2) loading recipe
    await model.loadRecipe(id); // because loadRecipe() will return a promise so we need to await it (it's similar to async func calling another async func)

    //3) rendering recipe
    recipeView.render(model.state.recipe);
  } catch (err) {
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

    // const page = model.state.search.query !== query ? 1 : undefined;

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
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
};

const controlAddBookmarks = function () {
  //1) Add/Remove bookmark
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);

  //2) Update Recipe view
  recipeView.update(model.state.recipe);

  //3)Render bookmarks
  bookmarkView.render(model.state.bookmarks);
};

const controlBookmark = function () {
  bookmarkView.render(model.state.bookmarks);
};

const init = function () {
  bookmarkView.addhandlerRender(controlBookmark);
  recipeView.addHandlerRender(controlRecipes);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerPagination(controlPagination);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmarks(controlAddBookmarks);
};

init();
