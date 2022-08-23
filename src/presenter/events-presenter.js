import WayPointListView from '../view/waypoint-list-view.js';
import WayPointView from '../view/waypoint-view.js';
import EditFormView from '../view/edit-form-view.js';
import EmptyListView from '../view/empty-list-view.js';
import SortView from '../view/sort-view.js';
import { isEscapeKey } from '../utils.js';
import { render, replace } from '../framework/render.js';

export default class EventsPresenter {

  #eventsContainer = null;
  #wayPointsModel = null;
  #wayPoints = [];
  #wayPointListComponent = new WayPointListView();

  constructor(eventsContainer, wayPointsModel) {
    this.#eventsContainer = eventsContainer;
    this.#wayPointsModel = wayPointsModel;
  }

  init = () => {
    this.#wayPoints = this.#wayPointsModel.wayPoints;
    this.#renderWayPointsList();
  };

  #renderWayPoint = (wayPoint) => {
    const wayPointComponent = new WayPointView(
      wayPoint,
      this.#wayPointsModel.getOffers(wayPoint),
      this.#wayPointsModel.getDestination(wayPoint)
    );

    const wayPointEditComponent = new EditFormView(wayPoint,
      this.#wayPointsModel.getOffersByType(wayPoint),
      this.#wayPointsModel.getDestination(wayPoint),
      this.#wayPointsModel.allDestinations);

    const replacePointToForm = () => replace(wayPointEditComponent, wayPointComponent);

    const replaceFormToPoint = () => replace(wayPointComponent, wayPointEditComponent);

    const onEscKeyDown = (evt) => {
      if (isEscapeKey(evt.key)) {
        evt.preventDefault();
        replaceFormToPoint();
        document.removeEventListener('keydown', onEscKeyDown);
      }
    };

    wayPointComponent.setRollupClickHandler(() => {
      replacePointToForm();
      document.addEventListener('keydown', onEscKeyDown);
    });

    wayPointEditComponent.setRollupClickHandler(() => {
      replaceFormToPoint();
      document.removeEventListener('keydown', onEscKeyDown);
    });

    wayPointEditComponent.setFormSubmitHandler(() => {
      replaceFormToPoint();
      document.removeEventListener('keydown', onEscKeyDown);
    });

    render(wayPointComponent, this.#wayPointListComponent.element);
  };

  #renderWayPointsList = () => {
    if (this.#wayPoints.length === 0) {
      render(new EmptyListView(), this.#eventsContainer);
    } else {
      render(new SortView(), this.#eventsContainer);
      render(this.#wayPointListComponent, this.#eventsContainer);
      for (let i = 0; i < this.#wayPoints.length; i++) {
        this.#renderWayPoint(this.#wayPoints[i]);
      }
    }
  };


}
