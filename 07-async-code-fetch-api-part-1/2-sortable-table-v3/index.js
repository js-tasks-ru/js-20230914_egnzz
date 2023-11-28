import SortableTable_v3 from '../../06-events-practice/1-sortable-table-v2/index.js';
import fetchJson from './utils/fetch-json.js';

const BACKEND_URL = 'https://course-js.javascript.ru';

export default class SortableTable extends SortableTable_v3 {
  constructor(header, {
    url,
    data = [],
    sorted = {
      id: header.find(item => item.sortable).id,
      order: 'asc',
    },
    isSortLocally,
  } = {}) {

    super(header, { data, sorted });
    this.url = url;
    this.isSortLocally = isSortLocally ?? false;
    this.fromRowNuber = 0;
    this.toRowNumber = 30;

    this.render(sorted.id, sorted.order);

    this.subElements.header.addEventListener("pointerdown", (evt) => {
      evt.stopPropagation();
      this.isSortLocally ? this.sortOnClient(this.headerFieldValue, sorted.order) : this.sortOnServer(this.headerFieldValue, sorted.order);
    });
  }

  async render(id, order) {
    this.subElements.body.style.display = "none";
    this.element.querySelector(".sortable-table__loading-line").style.display = "block";
    this.element.querySelector(".sortable-table__empty-placeholder").style.display = "none";

    const result = await fetchJson(`${BACKEND_URL}/${this.url}?_embed=subcategory.category&_sort=${id}&_order=${order}&_start=${this.fromRowNuber}&_end=${this.toRowNumber}`);
    
    this.element.querySelector(".sortable-table__loading-line").style.display = "none";
    if (result.length === 0) {this.element.querySelector(".sortable-table__empty-placeholder").style.display = "block";}
    else {
      this.subElements.body.style.display = "";
      super.update(Object.values(result));
    }
  }

  sortOnClient(id, order) {
    order === 'asc' ? order = 'desc' : order = 'asc';
    super.sort(id, order);
  }

  async sortOnServer (id, order) {
    this.subElements.body.style.display = "none";
    this.element.querySelector(".sortable-table__loading-line").style.display = "block";

    this.rowsNumber = this.element.querySelectorAll(".sortable-table__row").length - 1;
    if (this.toRowNumber < this.rowsNumber) {this.toRowNumber += this.rowsNumber;}

    const result = await fetchJson(`${BACKEND_URL}/${this.url}?_embed=subcategory.category&_sort=${id}&_order=${order}&_start=${this.fromRowNuber}&_end=${this.toRowNumber}`);

    this.element.querySelector(".sortable-table__loading-line").style.display = "none";
    this.subElements.body.style.display = "";
    this.update(result);
  }
}
