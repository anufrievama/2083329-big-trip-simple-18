import { createElement } from '../render.js';

const createWayPointListTemplate = () => '<ul class="trip-events__list"></ul>';

export default class WayPointListView {
  #element = null;

  getTemplate() {
    return createWayPointListTemplate();
  }

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.getTemplate());
    }
    return this.#element;
  }
}


