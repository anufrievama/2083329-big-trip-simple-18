import WayPointListView from '../view/way-point-list-view.js';
import WayPointView from '../view/way-point-view.js';
import EditFormView from '../view/edit-form-view.js';
import CreationFormView from '../view/creation-form-view.js';
import { render } from '../render.js';

export default class EventsPresenter {

  #eventsContainer = null;
  #wayPointsModel = null;
  #wayPoints = [];
  #wayPointListComponent = new WayPointListView();

  init = (eventsContainer, wayPointsModel) => {

    this.#eventsContainer = eventsContainer;
    this.#wayPointsModel = wayPointsModel;
    this.#wayPoints = this.#wayPointsModel.wayPoints;

    render(this.#wayPointListComponent, this.#eventsContainer);
    render(new EditFormView(this.#wayPoints[0],
      this.#wayPointsModel.getOffersByType(this.#wayPoints[0]),
      this.#wayPointsModel.getDestination(this.#wayPoints[0]),
      this.#wayPointsModel.allDestinations),
    this.#wayPointListComponent.element);
    render(new CreationFormView(this.#wayPointsModel.allOffers, this.#wayPointsModel.allDestinations), this.#wayPointListComponent.element);

    for (let i = 0; i < this.#wayPoints.length; i++) {
      this.#renderWayPont(this.#wayPoints[i]);
    }
  };

  #renderWayPont = (wayPoint) => {
    const wayPointComponent = new WayPointView(
      wayPoint,
      this.#wayPointsModel.getOffers(wayPoint),
      this.#wayPointsModel.getDestination(wayPoint)
    );
    render(wayPointComponent, this.#wayPointListComponent.element);
  };
}
