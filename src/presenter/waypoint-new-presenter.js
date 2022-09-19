import EditFormView from '../view/edit-form-view.js';
import { isEscapeKey } from '../utils.js';
import { render, remove, RenderPosition } from '../framework/render.js';
import { UserAction, UpdateType, DEFAULT_WAY_POINT } from '../mock/const.js';
import { nanoid } from 'nanoid';

export default class WayPointNewPresenter {

  #wayPointEditComponent = null;
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

    if (this.#wayPointEditComponent !== null) {
      return;
    }

    this.#wayPointEditComponent = new EditFormView(DEFAULT_WAY_POINT,
      this.#wayPointsModel.allDestinations,
      this.#wayPointsModel.allOffers);
    this.#wayPointEditComponent.setFormSubmitHandler(this.#handleFormSubmit);
    this.#wayPointEditComponent.setDeleteClickHandler(this.#handleDeleteClick);

    render(this.#wayPointEditComponent, this.#wayPointListComponent.element, RenderPosition.AFTERBEGIN);
    document.addEventListener('keydown', this.#escKeyDownHandler);
  };

  destroy = () => {
    if (this.#wayPointEditComponent === null) {
      return;
    }
    this.#destroyCallback?.();

    remove(this.#wayPointEditComponent);
    this.#wayPointEditComponent = null;
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
      { ...wayPoint, id: nanoid() },
    );
  };

  #handleDeleteClick = () => {
    this.destroy();
  };
}
