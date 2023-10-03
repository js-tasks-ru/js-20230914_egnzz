export default class ColumnChart {
  chartHeight = 50;
  //templateLink = this.link ? `<a class="column-chart__link" href="${this.link}">View all</a>` : "";
  constructor(props = {}) {
    const {
      data,
      label = '',
      link = '',
      value = 0,
      formatHeading = '',
    } = props;

    this.data = data;
    this.label = label;
    this.link = link;
    this.value = formatHeading ? formatHeading(value) : value;
    //this.templateLink = this.link ? `<a class="column-chart__link" href="${this.link}">View all</a>` : "";
    this.skeleton = '<image src="charts-skeleton.svg">';
    this.render();
  }

  render() {
    this.element = document.createElement("div");
    this.element.classList.add("column-chart");    
    this.element.style = `--chart-height: ${this.chartHeight}`;
    this.element.innerHTML = `${this.createTemplate(this.data)}`;
  }

  createTemplate(data) {
    return `
    <div class="column-chart__title">${this.label}${this.link ? `<a class="column-chart__link" href="${this.link}">View all</a>` : ""}</div> 
    <div class="column-chart__container">
      <div class="column-chart__header" data-element="header">${this.value}</div>
      <div class="column-chart__chart ${data ? 'column-chart_loading' : ''}" data-element="body">     
      ${data ? "" : this.skeleton}
      ${data ? this.getColumnProps(data) : ""}
      ${data ? "" : this.element.classList.add("column-chart_loading")}
      </div>
    </div>
    `;
  }


  getColumnProps(data) {
    const maxValue = Math.max(...data);
    return data.map(item => {
      return `<div
               style="--value: ${String(Math.floor(item * this.chartHeight / maxValue))}"
               data-tooltip = ${(item / maxValue * 100).toFixed(0) + '%'}>
               </div>`;
    }).join("");
  }

  update(newData) {
    this.element.innerHTML = this.createTemplate(newData);
  }

  remove() {
    this.element.remove();
  }

  destroy() {
    this.remove();
  }

}
