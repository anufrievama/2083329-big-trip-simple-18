import FilterView from './view/filter-view.js';
import EventsPresenter from './presenter/events-presenter.js';
import SortView from './view/sort-view';
import { render } from './render.js';

const controlsFiltersElement = document.querySelector('.trip-controls__filters');
const eventsContainerElement = document.querySelector('.trip-events');
const eventsPresenter = new EventsPresenter();

render(new FilterView(), controlsFiltersElement);
render(new SortView(), eventsContainerElement);

eventsPresenter.init(eventsContainerElement);
