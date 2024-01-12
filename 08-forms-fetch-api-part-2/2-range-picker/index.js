export default class RangePicker {
  constructor (date) {
    this.date = date;
    this.element = this.createElement(this.createInputHeadTemplate());
    this.subElements = {
      input: this.element.querySelector('[data-element="input"]'),
      selector: this.element.querySelector('[data-element="selector"]')
    };
    this.daySelection = {
      start: Date.parse(this.date.from),
      stop: Date.parse(this.date.to)
    };
    const millisecondsToDay = 24 * 60 * 60 * 1000;
    this.subElements.input.addEventListener("click", (evt) => {
      let rangepicker = evt.target.closest(".rangepicker");
      if (rangepicker.className.includes('rangepicker_open')) {
        rangepicker.classList.remove("rangepicker_open");
      }
      else {
        this.subElements.selector.innerHTML = this.createSelectorTemplate();
        rangepicker.classList.add("rangepicker_open");
      }
    });

    this.subElements.selector.addEventListener("click", (evt) => {
      if (evt.target.tagName === "BUTTON") {

        let buttons = this.subElements.selector.querySelectorAll(".rangepicker__cell");
        if (this.daySelection.stop != null) {
          for (let prop of buttons) {
            prop.classList.remove("rangepicker__selected-from");
            prop.classList.remove("rangepicker__selected-between");
            prop.classList.remove("rangepicker__selected-to");
          }

          evt.target.classList.add("rangepicker__selected-from");
          this.daySelection.start = Date.parse(evt.target.dataset.value) - millisecondsToDay;
          this.daySelection.stop = null;
        }
        else {
          this.daySelection.stop = Date.parse(evt.target.dataset.value) - millisecondsToDay;
          this.subElements.input.innerHTML = this.createInputBodyTimestampTemplate();
          this.subElements.selector.innerHTML = this.createSelectorTemplate();
          this.subElements.input.dispatchEvent(new MouseEvent("click", { bubles: true }));
        }
      }

      if (evt.target.className.includes("rangepicker__selector-control-left")) {
        this.date.from = new Date(this.date.from.setMonth(this.date.from.getMonth() - 1));
        this.date.to = new Date(this.date.to.setMonth(this.date.to.getMonth() - 1));
        this.subElements.input.innerHTML = this.createInputBodyTemplate();
        this.changeSelectorTemplate();
      }

      if (evt.target.className.includes("rangepicker__selector-control-right")) {
        this.date.to = new Date(this.date.to.setMonth(this.date.to.getMonth() + 1));
        this.date.from = new Date(this.date.from.setMonth(this.date.from.getMonth() + 1));
        this.subElements.input.innerHTML = this.createInputBodyTemplate();
        this.changeSelectorTemplate();
      }
    });

  }

  ruDate(ISOdate) {
    return ISOdate.split("T")[0].split("-").reverse().join(".");
  }

  createElement(template) {
    const element = document.createElement("div");
    element.innerHTML = `${template}`;
    return element.firstElementChild;
  }

  createInputHeadTemplate() {
    return `
         <div class="rangepicker">
         <div class="rangepicker__input" data-element="input">
          ${this.createInputBodyTemplate()}
         </div>
		     <div class="rangepicker__selector" data-element="selector"></div>
         </div>
        `;
  }

  createInputBodyTemplate() {
    return `
        <span data-element="from">${this.date.from.toLocaleDateString('ru-RU')}</span> -
        <span data-element="to">${this.date.to.toLocaleDateString('ru-RU')}</span>
        `;
  }

  createInputBodyTimestampTemplate() {
    return `
      <span data-element="from">${new Date(this.daySelection.start).toLocaleString("ru-RU",
        {
          day: 'numeric',
          month: 'numeric',
          year: 'numeric'
        }
      )}</span> -
      <span data-element="to">${ new Date(this.daySelection.stop).toLocaleString("ru-RU",
        {
          day: 'numeric',
          month: 'numeric',
          year: 'numeric'
        }
      )}</span>
      `;
  }

  createButtonsTemplate(fromto) {
    let dateFromTo;
    fromto === "from" ? dateFromTo = this.date.from : dateFromTo = this.date.to;

    const copyMonthDate = new Date(dateFromTo);
    const daysNumberOfMonth = 32 - new Date(copyMonthDate.setDate(32)).getDate();

    const copyDayDate = new Date(dateFromTo);
    const firstDayOfWeek = new Date(copyDayDate.setDate(1)).getDay();

    let htmlButtons = [];
    let startFrom = '';
    let selectedFromToBetween = '';

    for (let day = 1; day <= daysNumberOfMonth; day++) {
      if (day === 1) {startFrom = ` style="--start-from: ${firstDayOfWeek}"`;}
      else {startFrom = '';}
      const isoDate = Date.parse(this.setISODate(day, dateFromTo));
      if (isoDate === this.daySelection.start) {selectedFromToBetween = ` rangepicker__selected-from`;}
      if ((isoDate > this.daySelection.start) && (isoDate < this.daySelection.stop)) {selectedFromToBetween = ` rangepicker__selected-between`;}
      if (isoDate === this.daySelection.stop) {selectedFromToBetween = ` rangepicker__selected-to`;}
      if (isoDate > this.daySelection.stop) {selectedFromToBetween = ``;}
      htmlButtons.push(`
       <button type="button" class="rangepicker__cell${selectedFromToBetween}" data-value="${this.setISODate(day + 1, dateFromTo)}"${startFrom}>${day}</button>
      `);
    }
    return htmlButtons.join('');
  }

  setISODate(day, month) {
    const copyDayDate = new Date(month);
    return new Date(copyDayDate.setDate(day)).toISOString();
  }

  createSelectorTemplate() {
    return `
      <div class="rangepicker__selector-arrow"></div>
      <div class="rangepicker__selector-control-left"></div>
      <div class="rangepicker__selector-control-right"></div>
      <div class="rangepicker__calendar">
        <div class="rangepicker__month-indicator">
          <time datetime="${this.date.from.toLocaleString('ru-RU', {month: 'long'})}">${this.date.from.toLocaleString('ru-RU', {month: 'long'})}</time>
        </div>
      ${this.createHeaderDayOfWeek()}
        <div class="rangepicker__date-grid">
		${this.createButtonsTemplate("from")}
        </div>
      </div>
      <div class="rangepicker__calendar">
        <div class="rangepicker__month-indicator">
          <time datetime="${this.date.to.toLocaleString('ru-RU', { month: 'long' })}">${this.date.to.toLocaleString('ru-RU', { month: 'long' })}</time>
        </div>
        ${this.createHeaderDayOfWeek()}
        <div class="rangepicker__date-grid">
        ${this.createButtonsTemplate("to")}
        </div>
      </div>
		  `;
  }

  createHeaderDayOfWeek() {
    return `
      <div class="rangepicker__day-of-week">
        <div>Пн</div>
        <div>Вт</div>
        <div>Ср</div>
        <div>Чт</div>
        <div>Пт</div>
        <div>Сб</div>
        <div>Вс</div>
      </div>
    `;
  }

  changeSelectorTemplate() {
    const [leftCalendar, rightCalendar] = this.subElements.selector.querySelectorAll('.rangepicker__date-grid');
    leftCalendar.innerHTML = this.createButtonsTemplate("from");
    rightCalendar.innerHTML = this.createButtonsTemplate("to");

    const [leftTime, rightTime] = this.subElements.selector.querySelectorAll('time');
    leftTime.outerHTML = `
      <time datetime="${this.date.from.toLocaleString('ru-RU', {month: 'long'})}">${this.date.from.toLocaleString('ru-RU', {month: 'long'})}</time>
      `;
    rightTime.outerHTML = `
      <time datetime="${this.date.to.toLocaleString('ru-RU', {month: 'long'})}">${this.date.to.toLocaleString('ru-RU', {month: 'long'})}</time>
      `;
  }

  remove() {
    this.element.remove();
  }

  destroy () {
    this.remove();
  }

}
