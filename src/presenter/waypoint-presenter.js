import WayPointView from '../view/waypoint-view.js';
import EditFormView from '../view/edit-form-view.js';
import { isEscapeKey } from '../utils.js';
import { render, replace, remove } from '../framework/render.js';

export default class WayPointPresenter {

  #wayPoint = null;
  #wayPointComponent = null;
  #wayPointEditComponent = null;
  #wayPointsModel = null;
  #wayPointListComponent = null;

  constructor(wayPointsModel, wayPointListComponent) {
    this.#wayPointsModel = wayPointsModel;
    this.#wayPointListComponent = wayPointListComponent;
  }

  init = (wayPoint) => {
    this.#wayPoint = wayPoint;
    const prevWayPointComponent = this.#wayPointComponent;
    const prevWayPointEditComponent = this.#wayPointEditComponent;

    this.#wayPointComponent = new WayPointView(wayPoint,
      this.#wayPointsModel.getOffers(wayPoint),
      this.#wayPointsModel.getDestination(wayPoint));

    this.#wayPointEditComponent = new EditFormView(wayPoint,
      this.#wayPointsModel.getOffersByType(wayPoint),
      this.#wayPointsModel.getDestination(wayPoint),
      this.#wayPointsModel.allDestinations);

    this.#wayPointComponent.setRollupClickHandler(this.#handleExpandClick);
    this.#wayPointEditComponent.setRollupClickHandler(this.#handleRollupClick);
    this.#wayPointEditComponent.setFormSubmitHandler(this.#handleFormSubmit);

    if (prevWayPointComponent === null || prevWayPointEditComponent === null) {
      render(this.#wayPointComponent, this.#wayPointListComponent.element);
      return;
    }

    if (this.#wayPointListComponent.contains(prevWayPointComponent.element)) {
      replace(this.#wayPointComponent, prevWayPointComponent);
    }

    if (this.#wayPointListComponent.contains(prevWayPointEditComponent.element)) {
      replace(this.#wayPointEditComponent, prevWayPointEditComponent);
    }

    remove(prevWayPointComponent);
    remove(prevWayPointEditComponent);
  };

  destroy = () => {
    remove(this.#wayPointComponent);
    remove(this.#wayPointEditComponent);
  };

  #replacePointToForm = () => replace(this.#wayPointEditComponent, this.#wayPointComponent);

  #replaceFormToPoint = () => replace(this.#wayPointComponent, this.#wayPointEditComponent);

  #escKeyDownHandler = (evt) => {
    if (isEscapeKey(evt.key)) {
      evt.preventDefault();
      this.#replaceFormToPoint();
      document.removeEventListener('keydown', this.#escKeyDownHandler);
    }
  };

  #handleExpandClick = () => {
    this.#replacePointToForm();
    document.addEventListener('keydown', this.#escKeyDownHandler);
  };

  #handleRollupClick = () => {
    this.#replaceFormToPoint();
    document.removeEventListener('keydown', this.#escKeyDownHandler);
  };

  #handleFormSubmit = () => {
    this.#replaceFormToPoint();
    document.removeEventListener('keydown', this.#escKeyDownHandler);
  };

}
