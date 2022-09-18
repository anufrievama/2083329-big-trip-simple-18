import WayPointListView from '../view/waypoint-list-view.js';
import EmptyListView from '../view/empty-list-view.js';
import SortView from '../view/sort-view.js';
import WayPointPresenter from './waypoint-presenter.js';
import { sortWayPointDay, sortWayPointPrice, filter } from '../utils.js';
import { render, remove } from '../framework/render.js';
import { SortType, UpdateType, UserAction, FilterType } from '../mock/const.js';

export default class EventsPresenter {

  #eventsContainer = null;
  #wayPointsModel = null;
  #sortComponent = null;
  #filterModel = null;
  #emptyListComponent = null;
  #filterType = FilterType.EVERYTHING;
  #wayPointListComponent = new WayPointListView();
  #wayPointPresenter = new Map();
  #currentSortType = SortType.DAY;

  constructor(eventsContainer, wayPointsModel, filterModel) {
    this.#eventsContainer = eventsContainer;
    this.#wayPointsModel = wayPointsModel;
    this.#filterModel = filterModel;
    this.#wayPointsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  get wayPoints() {
    this.#filterType = this.#filterModel.filter;
    const wayPoints = this.#wayPointsModel.wayPoints;
    const filteredWayPoints = filter[this.#filterType](wayPoints);

    switch (this.#currentSortType) {
      case SortType.DAY:
        return filteredWayPoints.sort(sortWayPointDay);
      case SortType.PRICE:
        return filteredWayPoints.sort(sortWayPointPrice);
    }
    return filteredWayPoints;
  }

  init = () => {
    this.#renderPage();
  };

  #renderWayPoint = (wayPoint) => {
    const wayPointPresenter = new WayPointPresenter(this.#wayPointsModel,
      this.#wayPointListComponent,
      this.#handleViewAction,
      this.#handleModeChange);
    wayPointPresenter.init(wayPoint);
    this.#wayPointPresenter.set(wayPoint.id, wayPointPresenter);
  };

  #renderSort = () => {
    this.#sortComponent = new SortView(this.#currentSortType);
    this.#sortComponent.setSortTypeChangeHandler(this.#handleSortTypeChange);
    render(this.#sortComponent, this.#eventsContainer);
  };

  #renderEmptyList = () => {
    this.#emptyListComponent = new EmptyListView(this.#filterType);
    render(this.#emptyListComponent, this.#eventsContainer);
  };

  #handleModeChange = () => {
    this.#wayPointPresenter.forEach((presenter) => presenter.resetView());
  };

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }
    this.#currentSortType = sortType;
    this.#clearPage();
    this.#renderPage();
  };

  #handleViewAction = (actionType, updateType, update) => {
    switch (actionType) {
      case UserAction.UPDATE_WAYPOINT:
        this.#wayPointsModel.updateWayPoint(updateType, update);
        break;
      case UserAction.ADD_WAYPOINT:
        this.#wayPointsModel.addWayPoint(updateType, update);
        break;
      case UserAction.DELETE_WAYPOINT:
        this.#wayPointsModel.deleteWayPoint(updateType, update);
        break;
    }
  };

  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#wayPointPresenter.get(data.id).init(data);
        break;
      case UpdateType.MINOR:
        this.#clearPage();
        this.#renderPage();
        break;
      case UpdateType.MAJOR:
        this.#clearPage();
        this.#renderPage();
        break;
    }
  };

  #clearPage = ({ resetSortType = false } = {}) => {
    this.#wayPointPresenter.forEach((presenter) => presenter.destroy());
    this.#wayPointPresenter.clear();

    remove(this.#sortComponent);
    if (this.#emptyListComponent) {
      remove(this.#emptyListComponent);
    }

    if (resetSortType) {
      this.#currentSortType = SortType.DEFAULT;
    }
  };

  #renderPage = () => {
    const wayPoints = this.wayPoints;
    const wayPountCount = this.wayPoints.length;

    if (wayPountCount === 0) {
      this.#renderEmptyList();
      return;
    }

    this.#renderSort();
    render(this.#wayPointListComponent, this.#eventsContainer);
    wayPoints.forEach((wayPoint) => this.#renderWayPoint(wayPoint));
  };
}
