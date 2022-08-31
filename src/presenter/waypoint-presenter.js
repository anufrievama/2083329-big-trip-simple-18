import WayPointView from '../view/waypoint-view.js';
import EditFormView from '../view/edit-form-view.js';
import { isEscapeKey } from '../utils.js';
import { render, replace, remove } from '../framework/render.js';
import { Mode } from '../mock/const.js';

export default class WayPointPresenter {

  #wayPoint = null;
  #wayPointComponent = null;
  #wayPointEditComponent = null;
  #wayPointsModel = null;
  #wayPointListComponent = null;
  #changeData = null;
  #changeMode = null;
  #mode = Mode.DEFAULT;

  constructor(wayPointsModel, wayPointListComponent, changeData, changeMode) {
    this.#wayPointsModel = wayPointsModel;
    this.#wayPointListComponent = wayPointListComponent;
    this.#changeData = changeData;
    this.#changeMode = changeMode;
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

    if (this.#mode === Mode.DEFAULT) {
      replace(this.#wayPointComponent, prevWayPointComponent);
    }

    if (this.#mode === Mode.EDITING) {
      replace(this.#wayPointEditComponent, prevWayPointEditComponent);
    }

    remove(prevWayPointComponent);
    remove(prevWayPointEditComponent);
  };

  destroy = () => {
    remove(this.#wayPointComponent);
    remove(this.#wayPointEditComponent);
  };

  resetView = () => {
    if (this.#mode !== Mode.DEFAULT) {
      this.#replaceFormToPoint();
    }
  };

  #replacePointToForm = () => {
    replace(this.#wayPointEditComponent, this.#wayPointComponent);
    document.addEventListener('keydown', this.#escKeyDownHandler);
    this.#changeMode();
    this.#mode = Mode.EDITING;
  };

  #replaceFormToPoint = () => {
    replace(this.#wayPointComponent, this.#wayPointEditComponent);
    document.removeEventListener('keydown', this.#escKeyDownHandler);
    this.#mode = Mode.DEFAULT;
  };

  #escKeyDownHandler = (evt) => {
    if (isEscapeKey(evt.key)) {
      evt.preventDefault();
      this.#replaceFormToPoint();
      document.removeEventListener('keydown', this.#escKeyDownHandler);
    }
  };

  #handleExpandClick = () => {
    this.#replacePointToForm();
  };

  #handleRollupClick = () => {
    this.#replaceFormToPoint();
  };

  #handleFormSubmit = (wayPoint) => {
    this.#changeData(wayPoint);
    this.#replaceFormToPoint();
  };
}
