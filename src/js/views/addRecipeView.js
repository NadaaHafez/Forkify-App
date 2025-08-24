import View from './View.js';

class AddRecipeView extends View {
  _parentElement = document.querySelector('.upload');
  _message = 'Recipe was sucessfully uploaded ;)';

  _window = document.querySelector('.add-recipe-window');
  _overlay = document.querySelector('.overlay');
  _btnOpen = document.querySelector('.nav__btn--add-recipe');
  _btnClose = document.querySelector('.btn--close-modal');

  constructor() {
    super();
    this._addHandlerShowWindow();
    this._addHandlerHideWindow();
    this.addHandlerUpload();
    // the constructor’s code runs right away, but it doesn’t open the window.
    // It just ensures that when the user eventually clicks the button, the function is ready to fire.
  }

  //Open overlay/window by removing hidden class
  toggleWindow() {
    this._overlay.classList.toggle('hidden');
    this._window.classList.toggle('hidden');
  }

  //use arrow function becasue it doesn't have this and this here will refer to outer scope
  //OR this._btnOpen.addEventListener('click', this._toggleWindow.bind(this));
  _addHandlerShowWindow() {
    this._btnOpen.addEventListener('click', this.toggleWindow.bind(this));
  }

  _addHandlerHideWindow() {
    this._btnClose.addEventListener('click', this.toggleWindow.bind(this));
    this._overlay.addEventListener('click', this.toggleWindow.bind(this));
  }

  addHandlerUpload(handler) {
    this._parentElement.addEventListener('submit', function (e) {
      e.preventDefault();

      const formData = [...new FormData(this)]; //this not this._parentElement because this inside the listener is the parentEl
      const data = Object.fromEntries(formData);

      handler(data);
    });
  }
}

export default new AddRecipeView();
//get the form data
//create a json obj out of it
