import { render, replace, remove } from '../framework/render.js';
import FilterView from '../view/filter-view.js';
import { filter } from '../utils.js';
import { FilterType, UpdateType } from '../const.js';

export default class FilterPresenter {
  #filterContainer = null;
  #filterModel = null;
  #wayPointsModel = null;
  #filterComponent = null;

  constructor(filterContainer, filterModel, wayPointsModel) {
    this.#filterContainer = filterContainer;
    this.#filterModel = filterModel;
    this.#wayPointsModel = wayPointsModel;

    this.#wayPointsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  get filters() {
    const wayPoints = this.#wayPointsModel.wayPoints;
    const FILTER_TYPE_EVERYTHING = {
      type: FilterType.EVERYTHING,
      name: 'Everything',
      count: filter[FilterType.EVERYTHING](wayPoints).length,
    };

    const FILTER_TYPE_FUTURE = {
      type: FilterType.FUTURE,
      name: 'Future',
      count: filter[FilterType.FUTURE](wayPoints).length,
    };
    return [FILTER_TYPE_EVERYTHING, FILTER_TYPE_FUTURE];
  }

  init = () => {
    const filters = this.filters;
    const prevFilterComponent = this.#filterComponent;

    this.#filterComponent = new FilterView(filters, this.#filterModel.filter);
    this.#filterComponent.setFilterTypeChangeHandler(this.#handleFilterTypeChange);

    if (prevFilterComponent === null) {
      render(this.#filterComponent, this.#filterContainer);
      return;
    }

    replace(this.#filterComponent, prevFilterComponent);
    remove(prevFilterComponent);
  };

  #handleModelEvent = () => {
    this.init();
  };

  #handleFilterTypeChange = (filterType) => {
    if (this.#filterModel.filter === filterType) {
      return;
    }
    this.#filterModel.setFilter(UpdateType.MAJOR, filterType);
  };
}
