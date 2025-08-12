import View from './View.js';
import icons from '../../img/icons.svg';

class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');

  addHandlerPagination(handler) {
    this._parentElement.addEventListener('click', e => {
      const btn = e.target.closest('.btn--inline');
      if (!btn) return;
      const goToBtn = +btn.dataset.goto;

      handler(goToBtn);
    });
  }

  _generateMarkup() {
    const curPage = this._data.page;
    const numPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );

    //we're in page 1 and there's other pages "prev button only"
    if (curPage === 1 && numPages > 1) return this.generateMarkupNext(curPage);

    //if we are in page 2 will be prev and next button
    if (curPage < numPages) {
      return this.generateMarkupNext(curPage).concat(
        this.generateMarkupPrev(curPage)
      );
    }
    //if we are in the last page, only "prev button"
    if (curPage === numPages && numPages > 1)
      return this.generateMarkupPrev(curPage);

    //page one, and there is no other pages
    return '';
  }

  generateMarkupNext(page) {
    return `
          <button data-goto="${
            page + 1
          }" class="btn--inline pagination__btn--next">
            <span>Page ${page + 1}</span>
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-right"></use>
            </svg>
          </button>`;
  }

  generateMarkupPrev(page) {
    return ` <button data-goto="${
      page - 1
    }" class="btn--inline pagination__btn--prev">
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-left"></use>
            </svg>
            <span>Page ${page - 1}</span>
          </button>`;
  }
}

export default new PaginationView();
