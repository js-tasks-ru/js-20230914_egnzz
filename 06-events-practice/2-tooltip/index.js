class Tooltip {
  static lastInstanse;
  constructor () {

    this.render();
  }
	

  render() {
    this.element = this.createElement(this.createTemplate());
  }

  createElement(template) {
    const element = document.createElement("div");

    element.innerHTML = template;

    return element.firstElementChild;
  }
	
  createTemplate() {
    return `
    <div class="tooltip">This is tooltip</div>
    `;
  }


  initialize() {

    if (Tooltip.lastInstanse) {
      Tooltip.lastInstanse.destroy();
    }

    Tooltip.lastInstanse = this;

    this.tooltip = document.querySelector('[data-tooltip = "bar-bar-bar"]');

    this.tooltip.addEventListener(("pointerover"), this.handlerOver);
    this.tooltip.addEventListener(("pointerout"), this.handlerOut); 
  
    this.handlerOver = () => { document.body.append(this.element); };   
    this.handlerOut = () => { this.destroy(); };
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
