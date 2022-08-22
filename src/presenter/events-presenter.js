import WayPointListView from '../view/way-point-list-view.js';
import WayPointView from '../view/way-point-view.js';
import EditFormView from '../view/edit-form-view.js';
import { isEscapeKey } from '../utils.js';
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

    const wayPointEditComponent = new EditFormView(wayPoint,
      this.#wayPointsModel.getOffersByType(wayPoint),
      this.#wayPointsModel.getDestination(wayPoint),
      this.#wayPointsModel.allDestinations);


    const replacePointToForm = () => this.#wayPointListComponent.element.replaceChild(wayPointEditComponent.element, wayPointComponent.element);

    const replaceFormToPoint = () => this.#wayPointListComponent.element.replaceChild(wayPointComponent.element, wayPointEditComponent.element);

    const onEscKeyDown = (evt) => {
      if (isEscapeKey(evt.key)) {
        evt.preventDefault();
        replaceFormToPoint();
        document.removeEventListener('keydown', onEscKeyDown);
      }
    };

    wayPointComponent.element.querySelector('.event__rollup-btn').addEventListener('click', () => {
      replacePointToForm();
      document.addEventListener('keydown', onEscKeyDown);
    });

    wayPointEditComponent.element.querySelector('.event__rollup-btn').addEventListener('click', () => {
      replaceFormToPoint();
      document.removeEventListener('keydown', onEscKeyDown);
    });

    wayPointEditComponent.element.querySelector('.event__save-btn').addEventListener('click', (evt) => {
      evt.preventDefault();
      replaceFormToPoint();
      document.removeEventListener('keydown', onEscKeyDown);
    });

    render(wayPointComponent, this.#wayPointListComponent.element);
  };
}
