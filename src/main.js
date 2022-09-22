import EventsPresenter from './presenter/events-presenter.js';
import FilterPresenter from './presenter/filter-presenter.js';
import WayPointsModel from './model/waypoints-model.js';
import FilterModel from './model/filter-model.js';
import WayPointsApiService from './waypoints-api-service.js';

const AUTHORIZATION = 'Basic jdn56le3hYJkf89';
const END_POINT = 'https://18.ecmascript.pages.academy/big-trip';

const controlsFiltersElement = document.querySelector('.trip-controls__filters');
const eventsContainerElement = document.querySelector('.trip-events');
const newEventButtonElement = document.querySelector('.trip-main__event-add-btn');

const wayPointsModel = new WayPointsModel(new WayPointsApiService(END_POINT, AUTHORIZATION));
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
