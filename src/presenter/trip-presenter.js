import WayPointListView from '../view/waypoint-list-view.js';
import EmptyListView from '../view/empty-list-view.js';
import SortView from '../view/sort-view.js';
import LoadingView from '../view/loading-view.js';
import WayPointPresenter from './waypoint-presenter.js';
import WayPointNewPresenter from './waypoint-new-presenter.js';
import UiBlocker from '../framework/ui-blocker/ui-blocker.js';
import { sortWayPointDay, sortWayPointPrice, filter } from '../utils.js';
import { render, remove, RenderPosition } from '../framework/render.js';
import { SortType, UpdateType, UserAction, FilterType, TimeLimit } from '../const.js';

export default class TripPresenter {

  #tripContainer = null;
  #wayPointsModel = null;
  #sortComponent = null;
  #filterModel = null;
  #emptyListComponent = null;
  #filterType = FilterType.EVERYTHING;
  #wayPointListComponent = new WayPointListView();
  #loadingComponent = new LoadingView();
  #wayPointPresenter = new Map();
  #wayPointNewPresenter = null;
  #currentSortType = SortType.DAY;
  #isLoading = true;
  #uiBlocker = new UiBlocker(TimeLimit.LOWER_LIMIT, TimeLimit.UPPER_LIMIT);

  constructor(tripContainer, wayPointsModel, filterModel) {
    this.#tripContainer = tripContainer;
    this.#wayPointsModel = wayPointsModel;
    this.#filterModel = filterModel;
    this.#wayPointNewPresenter = new WayPointNewPresenter(this.#wayPointsModel,
      this.#wayPointListComponent,
      this.#handleViewAction);
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

  createWayPoint = (callback) => {
    this.#currentSortType = SortType.DAY;
    this.#filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
    this.#wayPointNewPresenter.init(callback);
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
    render(this.#sortComponent, this.#tripContainer);
  };

  #renderEmptyList = () => {
    this.#emptyListComponent = new EmptyListView(this.#filterType);
    render(this.#emptyListComponent, this.#tripContainer);
    remove(this.#loadingComponent);
  };

  #renderLoading = () => {
    render(this.#loadingComponent, this.#tripContainer, RenderPosition.AFTERBEGIN);
  };

  #handleModeChange = () => {
    this.#wayPointNewPresenter.destroy();
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

  #handleViewAction = async (actionType, updateType, update) => {
    this.#uiBlocker.block();
    switch (actionType) {
      case UserAction.UPDATE_WAYPOINT:
        this.#wayPointPresenter.get(update.id).setSaving();
        try {
          await this.#wayPointsModel.updateWayPoint(updateType, update);
        } catch(err) {
          this.#wayPointPresenter.get(update.id).setAborting();
        }
        break;
      case UserAction.ADD_WAYPOINT:
        this.#wayPointNewPresenter.setSaving();
        try {
          await this.#wayPointsModel.addWayPoint(updateType, update);
        } catch(err) {
          this.#wayPointNewPresenter.setAborting();
        }
        break;
      case UserAction.DELETE_WAYPOINT:
        this.#wayPointPresenter.get(update.id).setDeleting();
        try {
          await this.#wayPointsModel.deleteWayPoint(updateType, update);
        } catch(err) {
          this.#wayPointNewPresenter.get(update.id).setAborting();
        }
        break;
    }
    this.#uiBlocker.unblock();
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
        this.#clearPage({ resetSortType: true });
        this.#renderPage();
        break;
      case UpdateType.INIT:
        this.#isLoading = false;
        remove(this.#loadingComponent);
        this.#renderPage();
        break;
    }
  };

  #clearPage = ({ resetSortType = false } = {}) => {
    this.#wayPointNewPresenter.destroy();
    this.#wayPointPresenter.forEach((presenter) => presenter.destroy());
    this.#wayPointPresenter.clear();

    remove(this.#sortComponent);
    remove(this.#loadingComponent);

    if (this.#emptyListComponent) {
      remove(this.#emptyListComponent);
    }

    if (resetSortType) {
      this.#currentSortType = SortType.DAY;
    }
  };

  #renderPage = () => {

    if (this.#isLoading) {
      this.#renderLoading();
      return;
    }

    this.#renderSort();
    render(this.#wayPointListComponent, this.#tripContainer);
    const wayPoints = this.wayPoints;

    if (this.wayPoints.length === 0) {
      this.#renderEmptyList();
      return;
    }
    wayPoints.forEach((wayPoint) => this.#renderWayPoint(wayPoint));

  };
}
