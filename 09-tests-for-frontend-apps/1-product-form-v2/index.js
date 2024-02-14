import SortableList from '../2-sortable-list/index.js';
import escapeHtml from './utils/escape-html.js';
import fetchJson from './utils/fetch-json.js';

const IMGUR_CLIENT_ID = '28aaa2e823b03b1';
const BACKEND_URL = 'https://course-js.javascript.ru';

export default class ProductForm {
  constructor (productId) {
    this.productId = productId;
    this.category = [];
  }

  async render () {
    if (this.productId) {
      this.category = await fetchJson(`${BACKEND_URL}/api/rest/categories?_refs=subcategory`);
      this.productData = await fetchJson(`${BACKEND_URL}/api/rest/products?id=${this.productId}`);
      this.element = this.createElement(this.createBodyTemplate());
    }
    else {
      this.element = this.createElement(this.createBodyTemplate());
    }

    this.subElements = {
      productForm: this.element.querySelector('[data-element="productForm"]'),
      imageListContainer: this.element.querySelector('[data-element="imageListContainer"]'),
      inputFields: this.element.querySelectorAll('[id]')
    };

    this.data = this.productData[0].images;
    this.createImagesTemplate();
    this.subElements.imageListContainer.append(this.sortableList.element);

    if (this.productId) {
      for (let prop of this.subElements.inputFields) {
        prop.value = this.productData[0][prop.id];
      }
    }

    this.element.addEventListener("submit", async (evt) => {
      evt.preventDefault();
      this.form = new FormData(this.element.firstElementChild);
      this.formToSend = {};

      this.formToSend.id = this.productId;
      this.formToSend.title = this.form.get("title");
      this.formToSend.description = this.form.get("description");
      this.formToSend.quantity = Number(this.form.get("quantity"));
      this.formToSend.subcategory = this.form.get("subcategory");
      this.formToSend.status = Number(this.form.get("status"));
      this.formToSend.price = Number(this.form.get("price"));
      this.formToSend.discount = Number(this.form.get("discount"));

      this.formToSend.rating = 5;
      this.formToSend.brand = "Lenovo";
      this.formToSend.characteristics = [];
      this.formToSend.images = [];

      this.response = await fetchJson(
        `${BACKEND_URL}/api/rest/products`,
        {
          method: 'POST',
          body: JSON.stringify(this.formToSend)
        }
      );
      this.result = await this.response.json(response);
      this.save();

    });

    return this.element;
  }

  save() {
    this.productId ?
      this.element.dispatchEvent(new CustomEvent("product-updated", { bubbles: true, detail: "product-updated" })) :
      this.element.dispatchEvent(new CustomEvent("product-saved", { bubbles: true, detail: "product-saved" }));
  }

  createElement(template) {
    const element = document.createElement("div");
    element.innerHTML = `${template}`;
    return element.firstElementChild;
  }

  createBodyTemplate() {
    return `
    <div class="product-form">
    <form data-element="productForm" class="form-grid">
      <div class="form-group form-group__half_left">
        <fieldset>
          <label class="form-label">Название товара</label>
          <input id="title" required="" type="text" name="title" class="form-control" placeholder="Название товара">
        </fieldset>
      </div>
      <div class="form-group form-group__wide">
        <label class="form-label">Описание</label>
        <textarea id="description" required="" class="form-control" name="description" data-element="productDescription" placeholder="Описание товара"></textarea>
      </div>
      <div class="form-group form-group__wide" data-element="sortable-list-container">
        <label class="form-label">Фото</label>
        <div data-element="imageListContainer"></div>
        <button type="button" name="uploadImage" class="button-primary-outline"><span>Загрузить</span></button>
      </div>
      <div class="form-group form-group__half_left">
        <label class="form-label">Категория</label>
        <select id="subcategory"  class="form-control" name="subcategory">
        ${this.createSelectItems()}
        </select>
      </div>
      <div class="form-group form-group__half_left form-group__two-col">
        <fieldset>
          <label class="form-label">Цена ($)</label>
          <input id="price" required="" type="number" name="price" class="form-control" placeholder="100">
        </fieldset>
        <fieldset>
          <label class="form-label">Скидка ($)</label>
          <input id="discount" required="" type="number" name="discount" class="form-control" placeholder="0">
        </fieldset>
      </div>
      <div class="form-group form-group__part-half">
        <label class="form-label">Количество</label>
        <input id="quantity" required="" type="number" class="form-control" name="quantity" placeholder="1">
      </div>
      <div class="form-group form-group__part-half">
        <label class="form-label">Статус</label>
        <select id="status" class="form-control" name="status">
          <option value="1">Активен</option>
          <option value="0">Неактивен</option>
        </select>
      </div>
      <div class="form-buttons">
        <button type="submit" name="save" class="button-primary-outline">
          Сохранить товар
        </button>
      </div>
    </form>
  </div>
    `;
  }

  createSelectItems() {
    return this.category.map(item => {
      return item.subcategories.map(subitem => { return `<option value=${item.id}>${item.title} > ${subitem.title}</option>`;}).join('');
    }).join('');
  }

  createImagesTemplate() {
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

  remove() {
    this.element.remove();
  }

  destroy () {
    this.remove();
  }

}
