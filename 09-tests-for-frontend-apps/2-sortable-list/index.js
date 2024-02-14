export default class SortableList {
  constructor (Items) {
    this.items = Items;
    this.element = document.createElement('ul');

    this.items.items.forEach((prop) => {
      prop.classList.add('sortable-list__item');
      this.element.append(prop);
    });

    this.dragElementsList = this.element.querySelectorAll(".sortable-list__item");
    this.createEventListeners();
  }

  createEventListeners() {
    this.element.addEventListener("pointerdown", (evtClick) => {
      this.clickedElement = evtClick.target.closest(".sortable-list__item");
      if (evtClick.target.hasAttribute("data-grab-handle")) {
        this.dragElement = this.clickedElement.cloneNode(true);

        this.element.append(this.dragElement);
        this.dragElement.classList.add("sortable-list__placeholder");

        this.dragElement.style.left = (evtClick.clientX - this.element.getBoundingClientRect().left) + 'px';
        this.dragElement.style.top = (evtClick.clientY - this.element.getBoundingClientRect().top) + 'px';

        this.currentDroppable = null;
        this.droppableBelow = null;
        this.dragElement.style.position = 'absolute';
        this.dragElement.style.zIndex = 10000;

        this.onMouseMove = (evtDrag) => {
          this.dragElement.style.left = (evtDrag.clientX - this.element.getBoundingClientRect().left) + 'px';
          this.dragElement.style.top = (evtDrag.clientY - this.element.getBoundingClientRect().top) + 'px';

          this.dragElement.hidden = true;
          this.elemBelow = document.elementFromPoint(evtDrag.clientX - 1, evtDrag.clientY);
          this.dragElement.hidden = false;

          if (!this.elemBelow) {return;}

          this.droppableBelow = this.elemBelow.closest('.sortable-list__item');

          if (this.currentDroppable != this.droppableBelow) {
            if (this.currentDroppable) {
              for (let prop of this.dragElementsList) {
                prop.classList.remove("sortable-list__placeholder");
              }
            }
            this.currentDroppable = this.droppableBelow;
            if (this.currentDroppable) {
              if (this.droppableBelow) {
                this.droppableBelow.classList.add("sortable-list__placeholder");
              }
            }
          }
          this.currentDroppable = this.droppableBelow;
        };

        this.onMouseUp = () => {
          if (this.droppableBelow) {this.droppableBelow.before(this.clickedElement);}

          for (let prop of this.dragElementsList) {
            prop.classList.remove("sortable-list__placeholder");
          }

          this.dragElement.remove();
          document.removeEventListener('mousemove', this.onMouseMove);
          this.onMouseUp = null;
        };

        document.addEventListener('mousemove', this.onMouseMove);
        document.addEventListener('mouseup', this.onMouseUp);

        this.element.ondragstart = () => {
          return false;
        };
        this.element.onselectstart = () => {
          return false;
        };
      }


      if (evtClick.target.hasAttribute("data-delete-handle")) {
        evtClick.target.closest(".sortable-list__item").remove();
      }
    });

  }

  remove() {
    this.element.remove();
  }

  destroy() {
    this.remove();
  }

}
