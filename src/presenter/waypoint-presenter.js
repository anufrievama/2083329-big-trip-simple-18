import WayPointView from '../view/waypoint-view.js';
import EditFormView from '../view/edit-form-view.js';
import { isEscapeKey, getOffers, getDestinationById, isDatesEqual } from '../utils.js';
import { render, replace, remove } from '../framework/render.js';
import { Mode, UserAction, UpdateType } from '../const.js';

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
      getOffers(wayPoint, this.#wayPointsModel.offers),
      getDestinationById(wayPoint.destination, this.#wayPointsModel.destinations));

    this.#wayPointEditComponent = new EditFormView(wayPoint,
      this.#wayPointsModel.destinations,
      this.#wayPointsModel.offers);

    this.#wayPointComponent.setRollupClickHandler(this.#handleExpandClick);
    this.#wayPointEditComponent.setRollupClickHandler(this.#handleRollupClick);
    this.#wayPointEditComponent.setFormSubmitHandler(this.#handleFormSubmit);
    this.#wayPointEditComponent.setDeleteClickHandler(this.#handleDeleteClick);

    if (prevWayPointComponent === null || prevWayPointEditComponent === null) {
      render(this.#wayPointComponent, this.#wayPointListComponent.element);
      return;
    }

    if (this.#mode === Mode.DEFAULT) {
      replace(this.#wayPointComponent, prevWayPointComponent);
    }

    if (this.#mode === Mode.EDITING) {
      replace(this.#wayPointComponent, prevWayPointEditComponent);
      this.#mode = Mode.DEFAULT;
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
      this.#wayPointEditComponent.reset(this.#wayPoint);
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
      this.#wayPointEditComponent.reset(this.#wayPoint);
      this.#replaceFormToPoint();
      document.removeEventListener('keydown', this.#escKeyDownHandler);
    }
  };

  #handleExpandClick = () => {
    this.#replacePointToForm();
  };

  #handleRollupClick = () => {
    this.#wayPointEditComponent.reset(this.#wayPoint);
    this.#replaceFormToPoint();
  };

  #handleFormSubmit = (update) => {
    const isMinorUpdate = !(isDatesEqual(this.#wayPoint.dateFrom, update.dateFrom) && isDatesEqual(this.#wayPoint.dateTo, update.dateTo));
    this.#changeData(
      UserAction.UPDATE_WAYPOINT,
      isMinorUpdate ? UpdateType.MINOR : UpdateType.PATCH,
      update,
    );
    this.#replaceFormToPoint();
  };

  #handleDeleteClick = (wayPoint) => {
    this.#changeData(
      UserAction.DELETE_WAYPOINT,
      UpdateType.MINOR,
      wayPoint,
    );
  };

  setSaving = () => {
    if (this.#mode === Mode.EDITING) {
      this.#wayPointEditComponent.updateElement({
        isDisabled: true,
        isSaving: true,
      });
    }
  };

  setDeleting = () => {
    if (this.#mode === Mode.EDITING) {
      this.#wayPointEditComponent.updateElement({
        isDisabled: true,
        isDeleting: true,
      });
    }
  };
}
