import { createElement } from '../render.js';

const createEmptyListTemplate = () => '<p class="trip-events__msg">Click New Event to create your first point</p>';

export default class EmptyListView {
  #element = null;

  getTemplate() {
    return createEmptyListTemplate();
  }

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.getTemplate());
    }
    return this.#element;
  }
}
