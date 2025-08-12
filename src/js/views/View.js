import icons from 'url:../../img/icons.svg'; // parcel2

export default class View {
  _data;

  render(data) {
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderError();

    this._data = data;

    const markup = this._generateMarkup();
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  //will update only text and attributes in DOM without having to rerender the view
  update(data) {
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderError();

    this._data = data;
    /*2. DOM-based Comparison (JavaScript):
      For a more robust comparison that considers the structure and content of the HTML, you can parse the HTML into Document Object Model (DOM) trees and compare them programmatically.
      isEqualNode() Method: This JavaScript method, available on DOM nodes, can be used to compare two nodes. It returns true if the nodes have the same tag name, attributes (with identical values), and content, including the content of their descendants. This provides a deep comparison of the structure and data. */

    //we are creating a new markup to compare the new HTML with the current HTML and only change texts and attributes that have changed
    //we will turn this markup from string to DOM element that lives in the memory and compare it to the current html
    const newMarkup = this._generateMarkup();

    const newDom = document.createRange().createContextualFragment(newMarkup); //virtual DOM
    const newElements = newDom.querySelectorAll('*');
    console.log(Object.groupBy(newElements));
  }

  _clear() {
    this._parentElement.innerHTML = '';
  }

  renderSpinner() {
    const markup = `
      <div class="spinner">
              <svg>
                <use href="${icons}#icon-loader"></use>
              </svg>
            </div>`;

    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  renderError(message = this._errorMessage) {
    const markup = `
              <div class="error">
                      <div>
                        <svg>
                          <use href="${icons}#icon-alert-triangle"></use>
                        </svg>
                      </div>
                      <p>${message}</p>
                    </div>`;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  renderMessage(message = this._message) {
    const markup = `
              <div class="message">
                      <div>
                        <svg>
                          <use href="${icons}#icon-smile"></use>
                        </svg>
                      </div>
                      <p>${message}</p>
                    </div>`;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }
}
