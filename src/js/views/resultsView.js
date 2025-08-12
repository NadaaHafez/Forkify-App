import View from './View.js';
import icons from 'url:../../img/icons.svg';

class ResultsView extends View {
  _parentElement = document.querySelector('.results');
  _errorMessage = 'No Recipe Found for your query! Please try again! ;)';
  _message = '';

  _generateMarkup() {
    const markup = this._data.map(this._generateMarkupPreview).join('');
    return markup;
  }

  _generateMarkupPreview(results) {
    return `<li class="preview">
                <a class="preview__link" href="#${results.id}">
                <figure class="preview__fig">
                    <img src="${results.image}" alt="${results.title}" />
                </figure>
                <div class="preview__data">
                    <h4 class="preview__title">${results.title}</h4>
                    <p class="preview__publisher">${results.publisher}</p>
                </div>
                </a>
            </li>`;
  }
}

export default new ResultsView();
// preview__link--active
