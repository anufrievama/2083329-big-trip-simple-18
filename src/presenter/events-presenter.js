import WayPointListView from '../view/waypoint-list-view.js';
import EmptyListView from '../view/empty-list-view.js';
import SortView from '../view/sort-view.js';
import WayPointPresenter from './waypoint-presenter.js';
import { updateWayPoint } from '../utils.js';
import { render } from '../framework/render.js';

export default class EventsPresenter {

  #eventsContainer = null;
  #wayPointsModel = null;
  #wayPoints = [];
  #wayPointListComponent = new WayPointListView();
  #sortComponent = new SortView();
  #emptyListComponent = new EmptyListView();
  #wayPointPresenter = new Map();

  constructor(eventsContainer, wayPointsModel) {
    this.#eventsContainer = eventsContainer;
    this.#wayPointsModel = wayPointsModel;
  }

  init = () => {
    this.#wayPoints = this.#wayPointsModel.wayPoints;
    this.#renderWayPointsList();
  };

  #renderWayPoint = (wayPoint) => {
    const wayPointPresenter = new WayPointPresenter(this.#wayPointsModel,
      this.#wayPointListComponent,
      this.#handleWayPointChange,
      this.#handleModeChange);
    wayPointPresenter.init(wayPoint);
    this.#wayPointPresenter.set(wayPoint.id, wayPointPresenter);
  };

  #renderSort = () => render(this.#sortComponent, this.#eventsContainer);

  #renderEmptyList = () => render(this.#emptyListComponent, this.#eventsContainer);

  #renderWayPointsList = () => {
    if (this.#wayPoints.length === 0) {
      this.#renderEmptyList();
    } else {
      this.#renderSort();
      render(this.#wayPointListComponent, this.#eventsContainer);
      for (let i = 0; i < this.#wayPoints.length; i++) {
        this.#renderWayPoint(this.#wayPoints[i]);
      }
    }
  };

  #clearWayPointsList = () => {
    this.#wayPointPresenter.forEach((presenter) => presenter.destroy());
    this.#wayPointPresenter.clear();
  };

  #handleWayPointChange = (updatedWayPoint) => {
    this.#wayPoints = updateWayPoint(this.#wayPoints, updatedWayPoint);
    this.#wayPointPresenter.get(updatedWayPoint.id).init(updatedWayPoint);
  };

  #handleModeChange = () => {
    this.#wayPointPresenter.forEach((presenter) => presenter.resetView());
  };

}
