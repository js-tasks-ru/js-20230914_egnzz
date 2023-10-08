export default class SortableTable {

  subElements = {};

  constructor(headerConfig = [], data = []) {
    this.headerConfig = headerConfig;
    this.data = data;

    this.element = this.createElement(this.createTemplate());

    this.subElements = {
      body: this.element.querySelector('[data-element="body"]')
    };

  }
  
  createElement(template) {
    this.element = document.createElement("div");
    this.element.innerHTML = `<div data-element="productsContainer" class="products-list__container">${template}</div>`;
    return this.element.firstElementChild;
  }

  createTemplate() { 
    const bodyData = this.data.map((item) => {
      return `
  <div data-element="body" class="sortable-table__body">
  <a href="/products/3d-ochki-epson-elpgs03" class="sortable-table__row">
    <div class="sortable-table__cell">
      <img class="sortable-table-image" alt="Image" src="${'item.images[0].url'}">
    </div>
    <div class="sortable-table__cell">${item.title}</div>

    <div class="sortable-table__cell">${item.quantity}</div>
    <div class="sortable-table__cell">${item.price}</div>
    <div class="sortable-table__cell">${item.sales}</div>
  </a>
</div>
`;
    }).join('');

    const headerData = this.headerConfig.map((item) => {
      item.id.includes('title') ? this.arrow = `
        <span data-element="arrow" class="sortable-table__sort-arrow">
        <span class="sort-arrow"></span>
        </span>`
        : this.arrow = "";

      return `
       <div class="sortable-table__cell" data-id="images" data-sortable="false" data-order="asc">
        <span>${item.title}</span>
        ${this.arrow}
      </div>
   `;
    }).join('');

    return `
  <div class="sortable-table">
    <div data-element="header" class="sortable-table__header sortable-table__row">
    ${headerData}
    </div>
    ${bodyData}
    <div data-element="loading" class="loading-line sortable-table__loading-line"></div>
    <div data-element="emptyPlaceholder" class="sortable-table__empty-placeholder">
      <div>
        <p>No products satisfies your filter criteria</p>
        <button type="button" class="button-primary-outline">Reset all filters</button>
      </div>
    </div>
  </div>
`;
  }

  sort(fieldValue, orderValue) {
    const direction = orderValue === 'asc' ? 1 : -1;

    if (fieldValue === ("title") || ("quantity") || ("price") || ("sales"))
    {
      if (fieldValue === "title") {
        this.sortedData = this.data.sort((a, b) => {
          return direction * (a[fieldValue]).localeCompare((b[fieldValue]), ["ru", "en"], { caseFirst: 'upper'});
        });
      }

      else {
        this.sortedData = this.data.sort((a, b) => {
          return direction * (a[fieldValue] - b[fieldValue]); 
        });
      }

      this.data = this.sortedData;
      this.element.innerHTML = this.createTemplate();

    }
  }

  remove() {
    this.element.remove();
  }

  destroy () {
    this.remove();
  }

}
