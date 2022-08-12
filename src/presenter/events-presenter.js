import SortView from '../view/sort-view.js';
import WayPointListView from '../view/way-point-list-view.js';
import WayPointView from '../view/way-point-view.js';
import CreationFormView from '../view/creation-form-view.js';
import EditFormView from '../view/edit-form-view.js';
import { render } from '../render.js';

export default class EventsPresenter {
  wayPointListComponent = new WayPointListView();

  init = (eventsContainer) => {
    this.eventsContainer = eventsContainer;
    render(new SortView(), this.eventsContainer);
    render(this.wayPointListComponent, this.eventsContainer);
    render(new EditFormView(), this.wayPointListComponent.getElement());
    render(new CreationFormView(), this.wayPointListComponent.getElement());
    for (let i = 0; i < 3; i++) {
      render(new WayPointView(), this.wayPointListComponent.getElement());
    }
  };
}
