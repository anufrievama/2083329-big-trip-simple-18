import FilterView from './view/filter-view.js';
import EventsPresenter from './presenter/events-presenter.js';
import WayPointsModel from './model/waypoints-model.js';
import { render } from './render.js';

const controlsFiltersElement = document.querySelector('.trip-controls__filters');
const eventsContainerElement = document.querySelector('.trip-events');
const wayPointsModel = new WayPointsModel();
const eventsPresenter = new EventsPresenter(eventsContainerElement, wayPointsModel);

render(new FilterView(), controlsFiltersElement);

eventsPresenter.init();
