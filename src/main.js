import FilterView from './view/filter-view.js';
import EventsPresenter from './presenter/events-presenter.js';
import WayPointsModel from './model/waypoints-model.js';
import { render } from './framework/render.js';
import { generateFilter } from './mock/filter.js';

const controlsFiltersElement = document.querySelector('.trip-controls__filters');
const eventsContainerElement = document.querySelector('.trip-events');
const wayPointsModel = new WayPointsModel();
const eventsPresenter = new EventsPresenter(eventsContainerElement, wayPointsModel);

const filters = generateFilter(wayPointsModel.wayPoints);
render(new FilterView(filters), controlsFiltersElement);

eventsPresenter.init();
