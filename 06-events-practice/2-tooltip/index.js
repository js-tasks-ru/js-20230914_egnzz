class Tooltip {
  static lastInstanse;
  constructor () {
    if (Tooltip.lastInstanse) {
      return Tooltip.lastInstanse;
    }
    this.render();
    Tooltip.lastInstanse = this;
  }
	
  render() {
    this.element = this.createElement(this.createTemplate());
    document.body.append(this.element);
  }

  createElement(template) {
    const element = document.createElement("div");

    element.innerHTML = template;

    return element.firstElementChild;
  }
	
  createTemplate() {
    return `
    <div class="tooltip">bar-bar-bar</div>
    `;
  }

  initialize() {
    this.tooltip = document.querySelector('[data-tooltip = "bar-bar-bar"]');
    this.tooltip.addEventListener(("pointerover"), this.handlerOver);
    this.tooltip.addEventListener(("pointerout"), this.handlerOut); 
  
    this.handlerOver = () => document.body.append(this.element);
    this.handlerOut = () => this.destroy();
  }
  
  remove() {
    this.element.remove();
  }
  
  destroy() {
    this.remove();
    this.tooltip.removeEventListener(("pointerover"), this.handlerOver);
    this.tooltip.removeEventListener(("pointerout"), this.handlerOut);
  }
  
}

export default Tooltip;
