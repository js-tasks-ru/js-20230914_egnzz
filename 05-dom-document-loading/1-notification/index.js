export default class NotificationMessage {
    constructor(message,  props = {} ) {
        const {
            duration = 2000,
            type = 'success',
        } = props;

        this.duration = duration,
        this.type = type,
        this.message = message,

    this.element = document.createElement("div");
    this.element.textContent = this.message;
    this.element.classList.add(this.type);
    }

    createTemplateElement(element) {
    return `
    <div class="notification ${this.type}" style="--value:20s;">
     <div class="timer"></div>
      <div class="inner-wrapper">
      <div class="notification-header">${this.type}</div>
      <div class="notification-body">
       ${this.message}
      </div>
     </div>
    </div>`;
}

    show(elem) {
    if(elem) this.element = elem;
	document.body.append(this.element);
     this.element.innerHTML = this.createTemplateElement(this.element);

	 this.timer = setTimeout(() => {
	 this.destroy();
	},
	this.duration
	);
 }

 remove() {
    this.element.remove();
  }

  destroy() {
    this.timer = null;
    this.remove();
  }

}
