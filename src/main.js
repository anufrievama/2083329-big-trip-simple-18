import FilterView from './view/filter-view.js';
import EventsPresenter from './presenter/events-presenter.js';
import SortView from './view/sort-view';
import WayPointsModel from './model/way-points-model.js';
import { render } from './render.js';

const controlsFiltersElement = document.querySelector('.trip-controls__filters');
const eventsContainerElement = document.querySelector('.trip-events');
const eventsPresenter = new EventsPresenter();
const wayPointsModel = new WayPointsModel();

render(new FilterView(), controlsFiltersElement);
render(new SortView(), eventsContainerElement);

eventsPresenter.init(eventsContainerElement, wayPointsModel);
