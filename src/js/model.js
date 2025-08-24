import { API_URL, RES_PER_PAGE, KEY } from './config';
// import { getJSON, sendJSON } from './helper';
import { AJAX } from './helper.js';

export const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
    page: 1,
    resultsPerPage: RES_PER_PAGE,
  },
  bookmarks: [],
};

const createRecipeObject = function (data) {
  const { recipe } = data.data;

  return {
    publisher: recipe.publisher,
    ingredients: recipe.ingredients,
    sourceURL: recipe.source_url,
    image: recipe.image_url,
    title: recipe.title,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    id: recipe.id,
    ...(recipe.key && { key: recipe.key }), // short circuitting
  };
};

export const loadRecipe = async function (id) {
  try {
    const data = await AJAX(`${API_URL}${id}?key=${KEY}`);

    state.recipe = createRecipeObject(data);

    // mark if bookmarked while loading recipe "first thing "
    if (state.bookmarks.some(b => b.id === id)) state.recipe.bookmarked = true;
    else state.recipe.bookmarked = false;
  } catch (err) {
    throw err;
  }
};

export const loadSearchResults = async function (query) {
  try {
    state.search.query = query;
    const data = await AJAX(`${API_URL}?search=${query}&key=${KEY}`);

    state.search.results = data.data.recipes.map(rec => {
      return {
        publisher: rec.publisher,
        image: rec.image_url,
        title: rec.title,
        id: rec.id,
        ...(rec.key && { key: rec.key }), // short circuitting
      };
    });

    //set the page to 1 every time there is a new query/search
    state.search.page = 1;
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

const persistBookmarks = function () {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};

export const addBookmark = function (recipe) {
  state.bookmarks.push(recipe);

  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;

  persistBookmarks();
};

export const deleteBookmark = function (id) {
  const index = state.bookmarks.findIndex(el => el.id === id);
  state.bookmarks.slice(index, 1);

  if (id === state.recipe.id) state.recipe.bookmarked = false;

  persistBookmarks();
};

const init = function () {
  const storage = JSON.parse(localStorage.getItem('bookmarks'));
  if (storage) state.bookmarks = storage;
};

init();

const clearBookmark = function () {
  localStorage.clear('bookmarks');
};

// clearBookmark();

//recipe editor for the user to upload his own recipes
export const uploadRecipe = async function (newRecipe) {
  try {
    //Turn ingreidents into an array of object [quantity, unit, description]

    // const ingredients = Object.entries(newRecipe)
    //   .filter(
    //     ([key, value]) => key.startsWith('ingredient') && value.trim() !== ''
    //   )
    //   .map(([key, value]) => {
    //     const [quantity, unit, description] = value
    //       .split(',')
    //       .map(el => el.trim());

    //     return {
    //       quantity: quantity ? +quantity : null,
    //       unit,
    //       description,
    //     };
    //   });

    const ingredients = Object.entries(newRecipe)
      .filter(entry => entry[0].startsWith('ingredient') && entry[1] !== '')
      .map(ing => {
        const ingArr = ing[1].replaceAll(' ', '').split(',');
        if (ingArr.length !== 3)
          throw new Error(
            'Wrong ingredient Format; Please Enter the correct format ;)'
          );

        const [quantity, unit, description] = ingArr;
        return {
          quantity: quantity ? +quantity : null,
          unit,
          description,
        };
      });

    //Turn the data we have to match json format
    const recipe = {
      publisher: newRecipe.publisher,
      ingredients,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      title: newRecipe.title,
      servings: +newRecipe.servings,
      cooking_time: +newRecipe.cookingTime,
    };

    //send our data to API
    const data = await AJAX(`${API_URL}?key=${KEY}`, recipe);

    //we will recieve that data again and destructuring into our obj format
    state.recipe = createRecipeObject(data);

    //store bookmark to localStorage
    addBookmark(state.recipe);
  } catch (err) {
    throw err;
  }
};
