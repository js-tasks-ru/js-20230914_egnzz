export default class ColumnChart {
  constructor({data, label, value, link, formatHeading}) {
    this.data = data;
    this.label = label;
    this.link = link;
    this.value = formatHeading ? formatHeading(value) : value;
    this.templateLink = this.link ? `<a class="column-chart__link" href="${this.link}">View all</a>` : "";
    this.chartHeight = 50;
    this.columnchart_loading = 'column-chart_loading';
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
     if((typeof data !== 'undefined')) {
      if(data.length > 0) {
       this.columnchart_loading = "";
       this.skeleton = '';
       this.template = this.getColumnProps(data);
      } else this.template = '';
     } 
       else {
        this.template = '';
        this.element.classList.add("column-chart_loading");
       }
    return `
    <div class="column-chart__title">${this.label}${this.templateLink}</div> 
    <div class="column-chart__container">
      <div class="column-chart__header" data-element="header">${this.value}</div>
      <div class="column-chart__chart ${this.columnchart_loading}" data-element="body">
      ${this.skeleton}
      ${this.template}
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
               </div>`
    }).join("");
  }

update(newData) {
  this.element.innerHTML = `${this.createTemplate(newData)}`;
}

remove() {
    this.element.remove();
}

destroy() {
  this.remove();
 }

}
