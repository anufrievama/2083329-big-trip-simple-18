import AbstractView from '../framework/view/abstract-view';

const createWayPointListTemplate = () => '<ul class="trip-events__list"></ul>';

export default class WayPointListView extends AbstractView{
  get template() {
    return createWayPointListTemplate();
  }
}


