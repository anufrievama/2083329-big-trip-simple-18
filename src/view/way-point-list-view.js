import { createElement } from '../render.js';

const createWayPointListTemplate = () => '<ul class="trip-events__list"></ul>';

export default class WayPointListView {
  getTemplate() {
    return createWayPointListTemplate();
  }

  getElement() {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
    }
    return this.element;
  }
}


