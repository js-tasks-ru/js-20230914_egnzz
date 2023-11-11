const minmax = (value, min, max) => Math.max(min, Math.min(max, value));

export default class DoubleSlider {
    element;
    subElements = {};

    constructor (config = {}) {
      this.min = config.min ?? 100;
      this.max = config.max ?? 1000;
      this.selected = config.selected ?? {
        from: this.min,
        to: this.max
      };
      this.formatValue = config.formatValue ?? ((value) => value);
      this.element = this.createElement(this.createTemplate());
      this.createElement();
      this.selectSubElements();
      this.createEventListeners();
    }

    selectSubElements() {
      const subElements = this.element.querySelectorAll('[data-element]');
      Array.from(subElements).forEach(element => {
        this.subElements[element.getAttribute('data-element')] = element;
      });
    }

    createElement(template) {
      const element = document.createElement("div");

      element.innerHTML = template;

      return element.firstElementChild;
    }

    createTemplate() {
      this.setPercentsLeft = ((this.selected.from - this.min) * (this.max - this.min) / 100).toString();
      this.setPercentsRight = ((this.max - this.selected.to) * (this.max - this.min) / 100).toString();

      return `
      <div class="range-slider">
        <span data-element="from">${this.formatValue(this.selected.from)}</span>
        <div class="range-slider__inner" data-element="inner-slider">
          <span data-element="select-line" class="range-slider__progress" style="left: ${this.setPercentsLeft}%; right: ${this.setPercentsRight}%"></span>
          <span data-element="thumb-left" class="range-slider__thumb-left" style="left: ${this.setPercentsLeft}%"></span>
          <span data-element="thumb-right" class="range-slider__thumb-right" style="right: ${this.setPercentsRight}%"></span>
        </div>
        <span data-element="to">${this.formatValue(this.selected.to)}</span>
      </div>
        `;
    }

    createEventListeners() {
      this.subElements["thumb-left"].addEventListener('pointerdown', this.onThumbPointerDown);
      this.subElements["thumb-right"].addEventListener('pointerdown', this.onThumbPointerDown);
    }

    destroyEventListeners() {
      this.subElements["thumb-left"].removeEventListener('pointerdown', this.onThumbPointerDown);
      this.subElements["thumb-right"].removeEventListener('pointerdown', this.onThumbPointerDown);
    }

    onThumbPointerDown = (e) => {
      this.isLeftThumbDown = e.target.dataset.element === 'thumb-left';
      document.addEventListener("pointermove", this.onDocumentPointerMove);
      document.addEventListener("pointerup", this.onDocumentPointerUp);
    };

    onDocumentPointerMove = (e) => {
      const sliderRect = this.subElements["inner-slider"].getBoundingClientRect();
      const pointerX = e.clientX;
      const sliderLeftX = sliderRect.left;
      const sliderRightX = sliderRect.left + sliderRect.width;
      const thumbLeftX = sliderRect.left + this.selected.from * sliderRect.width;
      const thumbRightX = sliderRect.left + this.selected.to * sliderRect.width;

      const normalizedPointerX = this.isLeftThumbDown
        ? minmax(pointerX, sliderLeftX, thumbRightX)
        : minmax(pointerX, thumbLeftX, sliderRightX);

      const percentX = normalizedPointerX === sliderLeftX
        ? 0
        : Math.round((pointerX - sliderLeftX) / (sliderRightX - sliderLeftX) * 100);

      if (this.isLeftThumbDown) {
        this.selected.from = this.min + (percentX * (this.max - this.min)) / 100;

        if (this.selected.from <= this.selected.to) {
          this.subElements["from"].textContent = this.formatValue(this.selected.from);
          this.subElements["thumb-left"].style = `left: ${percentX}%`;
          this.setMovedRight = ((this.max - this.selected.to) * (this.max - this.min) / 100).toString();
          this.subElements["select-line"].style = `left: ${percentX}%; right: ${this.setMovedRight}%`;
        }
      } else {
        this.selected.to = this.min + (percentX * (this.max - this.min)) / 100;
        if ((this.selected.from <= this.selected.to) && (this.selected.to <= this.max)) {
          this.subElements["to"].textContent = this.formatValue(this.selected.to);
          this.subElements["thumb-right"].style = `right: ${100 - percentX}%`;
          this.setMovedLeft = ((this.selected.from - this.min) * (this.max - this.min) / 100).toString();
          this.subElements["select-line"].style = `left: ${this.setMovedLeft}%; right: ${100 - percentX}%`;
        }
      }
    };

    onDocumentPointerUp = (e) => {
      document.removeEventListener("pointermove", this.onDocumentPointerMove);
      document.removeEventListener("pointerup", this.onDocumentPointerUp);
      this.element.dispatchEvent(
        new CustomEvent('range-select', {
          detail: this.selected,
        })
      );
    };

    remove() {
      this.element.remove();
    }

    destroy() {
      this.destroyEventListeners();
      this.remove();
    }

}
