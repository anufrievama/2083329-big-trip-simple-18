import WayPointListView from '../view/way-point-list-view.js';
import WayPointView from '../view/way-point-view.js';
import CreationFormView from '../view/creation-form-view.js';
import EditFormView from '../view/edit-form-view.js';
import { render } from '../render.js';
const COUNT_WAY_POINTS = 3;

export default class EventsPresenter {
  wayPointListComponent = new WayPointListView();

  init = (eventsContainer) => {
    this.eventsContainer = eventsContainer;
    render(this.wayPointListComponent, this.eventsContainer);
    render(new EditFormView(), this.wayPointListComponent.getElement());
    render(new CreationFormView(), this.wayPointListComponent.getElement());
    for (let i = 0; i < COUNT_WAY_POINTS; i++) {
      render(new WayPointView(), this.wayPointListComponent.getElement());
    }
  };
}
