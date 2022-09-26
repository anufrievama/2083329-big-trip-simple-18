import AddFormView from '../view/add-form-view.js';
import { isEscapeKey } from '../utils.js';
import { render, remove, RenderPosition } from '../framework/render.js';
import { UserAction, UpdateType, DEFAULT_WAY_POINT } from '../const.js';

export default class WayPointNewPresenter {

  #wayPointAddComponent = null;
  #wayPointListComponent = null;
  #wayPointsModel = null;
  #changeData = null;
  #destroyCallback = null;

  constructor(wayPointsModel, wayPointListComponent, changeData) {
    this.#wayPointsModel = wayPointsModel;
    this.#wayPointListComponent = wayPointListComponent;
    this.#changeData = changeData;
  }

  init = (callback) => {
    this.#destroyCallback = callback;

    if (this.#wayPointAddComponent !== null) {
      return;
    }

    this.#wayPointAddComponent = new AddFormView(DEFAULT_WAY_POINT,
      this.#wayPointsModel.destinations,
      this.#wayPointsModel.offers);
    this.#wayPointAddComponent.setFormSubmitHandler(this.#handleFormSubmit);
    this.#wayPointAddComponent.setCancelClickHandler(this.#handleCancelClick);

    render(this.#wayPointAddComponent, this.#wayPointListComponent.element, RenderPosition.AFTERBEGIN);
    document.addEventListener('keydown', this.#escKeyDownHandler);
  };

  destroy = () => {
    if (this.#wayPointAddComponent === null) {
      return;
    }
    this.#destroyCallback?.();

    remove(this.#wayPointAddComponent);
    this.#wayPointAddComponent = null;
  };

  #escKeyDownHandler = (evt) => {
    if (isEscapeKey(evt.key)) {
      evt.preventDefault();
      this.destroy();
    }
  };

  #handleFormSubmit = (wayPoint) => {
    this.#changeData(
      UserAction.ADD_WAYPOINT,
      UpdateType.MINOR,
      wayPoint,
    );
  };

  #handleCancelClick = () => {
    this.destroy();
  };

  setSaving = () => {
    this.#wayPointAddComponent.updateElement({
      isDisabled: true,
      isSaving: true,
    });
  };
}
