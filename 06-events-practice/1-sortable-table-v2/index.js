import SortableTable_v1 from '../../05-dom-document-loading/2-sortable-table-v1/index.js';

export default class SortableTable extends SortableTable_v1
{
  constructor(headersConfig, {
    data = [],
    sorted = {}
  } = {}) {
    super(headersConfig, data);

    this.sorted = sorted;

    super.sort(this.sorted.id, this.sorted.order);

    this.headerClickEvent();
  }

  headerClickEvent() {
  this.columnHeaderElement = this.element.querySelector(".sortable-table__header");
  this.columnHeaderElement.addEventListener("click", (evt) => {

  this.headerArrowElement =  this.element.querySelector(".sortable-table__sort-arrow");
  this.headerFieldValue = evt.target.closest(".sortable-table__cell").append(this.headerArrowElement);    
  
  this.headerFieldValue = evt.target.closest(".sortable-table__cell").dataset.id;

  super.sort(this.headerFieldValue, this.sorted.order);


  });
  
 }

}

