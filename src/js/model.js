import { API_URL, RES_PER_PAGE } from './config';
import { getJSON } from './helper';

export const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
    page: 1,
    resultsPerPage: RES_PER_PAGE,
  },
};

export const loadRecipe = async function (id) {
  try {
    const data = await getJSON(`${API_URL}${id}`);
    const { recipe } = data.data;

    state.recipe = {
      publisher: recipe.publisher,
      ingredients: recipe.ingredients,
      sourceURL: recipe.source_url,
      image: recipe.image_url,
      title: recipe.title,
      servings: recipe.servings,
      cookingTime: recipe.cooking_time,
      id: recipe.id,
    };
    console.log(state.recipe);
  } catch (err) {
    throw err;
  }
};

export const loadSearchResults = async function (query) {
  try {
    state.search.query = query;
    const data = await getJSON(`${API_URL}?search=${query}`);

    state.search.results = data.data.recipes.map(rec => {
      return {
        publisher: rec.publisher,
        image: rec.image_url,
        title: rec.title,
        id: rec.id,
      };
    });
  } catch (err) {
    console.error(err);
    throw err;
  }
};

//reach into the state and get into the data that is being requested
//skip/offset/start = productPerPage * (page -1)
export const getSearchResultsPage = function (page = state.search.page) {
  state.search.page = page;
  const start = (page - 1) * state.search.resultsPerPage;
  const end = start + state.search.resultsPerPage;
  //or const end = page * state.search.resultsPerPage

  return state.search.results.slice(start, end);
};

export const updateServings = function (servings) {
  state.recipe.ingredients.forEach(ing => {
    //newQT = oldQT * newServings / oldServings / 2 * 8 / 4 = 4
    ing.quantity = (ing.quantity * servings) / state.recipe.servings;
  });

  state.recipe.servings = servings;
};

// export const updateServings = function (servings) {
//   const newIng = state.recipe.ingredients.map(ing => {
//     //newQT = oldQT * newServings / oldServings / 2 * 8 / 4 = 4
//     const newQuantity = (ing.quantity * servings) / state.recipe.servings;

//     ing.quantity = newQuantity;
//     return ing;
//   });

//   state.recipe.ingredients = newIng;
//   state.recipe.servings = servings;
// };
