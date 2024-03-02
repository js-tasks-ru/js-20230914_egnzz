import ProductForm_v1 from '../../08-forms-fetch-api-part-2/1-product-form-v1/index.js';
import SortableList from '../2-sortable-list/index.js';
import escapeHtml from './utils/escape-html.js';
const BACKEND_URL = 'https://course-js.javascript.ru';

export default class ProductForm_v2 extends ProductForm_v1 {
  constructor (productId) {
    super(productId);
  }

  async render () {
    await super.render();
    this.data = this.productData[0].images;

    this.subElements.imageListContainer.firstElementChild.remove();
    this.createImagesSortableTemplate();
    this.subElements.imageListContainer.append(this.sortableList.element);
  }

  createImagesSortableTemplate() {
    this.sortableList = new SortableList({
      items: this.data.map(item => {
        const element = document.createElement('li');
        element.classList.add('products-edit__imagelist-item');
        element.classList.add('sortable-list__item');
        element.innerHTML = `
  		  <input type="hidden" name="url" value="https://i.imgur.com/MWorX2R.jpg">
        <input type="hidden" name="source" value="75462242_3746019958756848_838491213769211904_n.jpg">
        <span>
          <img src="${BACKEND_URL}/assets/icons/icon-grab.svg" data-grab-handle="" alt="grab">
		    <img class="sortable-table__cell-img" alt="Image" src="${escapeHtml(item.url)}">
        <span>${item.source}</span>
        </span>
		    <button type="button">
          <img src="${BACKEND_URL}/assets/icons/icon-trash.svg" data-delete-handle="" alt="delete">
		    </button>
        `;
        return element;
      })
    });
  }

}
