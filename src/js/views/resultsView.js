import View from './View.js';
import previewView from './previewView.js';

class ResultsView extends View {
  _parentElement = document.querySelector('.results');
  _errorMessage = 'No Recipe Found for your query! Please try again! ;)';
  _message = '';

  _generateMarkup() {
    console.log(this._data);
    const markup = this._data
      .map(result => previewView.render(result, false))
      .join('');
    return markup;
  }
}

export default new ResultsView();
