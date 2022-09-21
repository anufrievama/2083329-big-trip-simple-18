import EventsPresenter from './presenter/events-presenter.js';
import FilterPresenter from './presenter/filter-presenter.js';
import WayPointsModel from './model/waypoints-model.js';
import FilterModel from './model/filter-model.js';

const controlsFiltersElement = document.querySelector('.trip-controls__filters');
const eventsContainerElement = document.querySelector('.trip-events');
const newEventButtonElement = document.querySelector('.trip-main__event-add-btn');

const wayPointsModel = new WayPointsModel();
const filterModel = new FilterModel();
const eventsPresenter = new EventsPresenter(eventsContainerElement, wayPointsModel, filterModel);
const filterPresenter = new FilterPresenter(controlsFiltersElement, filterModel, wayPointsModel);

const handleNewEventFormClose = () => {
  newEventButtonElement.disabled = false;
};
const handleNewEventButtonClick = () => {
  eventsPresenter.createWayPoint(handleNewEventFormClose);
  newEventButtonElement.disabled = true;
};
newEventButtonElement.addEventListener('click', handleNewEventButtonClick);

eventsPresenter.init();
filterPresenter.init();
