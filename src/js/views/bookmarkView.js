import View from './View.js';
import previewView from './previewView.js';

class bookmarkView extends View {
  _parentElement = document.querySelector('.bookmarks__list');
  _errorMessage = 'No bookmark yet. Find a nice recipe and bookmark it ;)';
  _message = '';

  addhandlerRender(handler) {
    window.addEventListener('load', handler);
  }

  _generateMarkup() {
    const markup = this._data
      .map(bookmark => previewView.render(bookmark, false))
      .join('');
    return markup;
  }
}

export default new bookmarkView();
