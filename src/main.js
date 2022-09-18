import EventsPresenter from './presenter/events-presenter.js';
import FilterPresenter from './presenter/filter-presenter.js';
import WayPointsModel from './model/waypoints-model.js';
import FilterModel from './model/filter-model.js';

const controlsFiltersElement = document.querySelector('.trip-controls__filters');
const eventsContainerElement = document.querySelector('.trip-events');
const wayPointsModel = new WayPointsModel();
const filterModel = new FilterModel();
const eventsPresenter = new EventsPresenter(eventsContainerElement, wayPointsModel, filterModel);
const filterPresenter = new FilterPresenter(controlsFiltersElement, filterModel, wayPointsModel);

eventsPresenter.init();
filterPresenter.init();
