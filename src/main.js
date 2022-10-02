import TripPresenter from './presenter/trip-presenter';
import FilterPresenter from './presenter/filter-presenter.js';
import WayPointsModel from './model/waypoints-model.js';
import FilterModel from './model/filter-model.js';
import WayPointsApiService from './waypoints-api-service.js';
import { AUTHORIZATION, END_POINT } from './const.js';

const controlsFiltersElement = document.querySelector('.trip-controls__filters');
const tripContainerElement = document.querySelector('.trip-events');
const addEventButtonElement = document.querySelector('.trip-main__event-add-btn');

const wayPointsModel = new WayPointsModel(new WayPointsApiService(END_POINT, AUTHORIZATION));
const filterModel = new FilterModel();
const tripPresenter = new TripPresenter(tripContainerElement, wayPointsModel, filterModel);
const filterPresenter = new FilterPresenter(controlsFiltersElement, filterModel, wayPointsModel);

const handleNewEventFormClose = () => {
  addEventButtonElement.disabled = false;
};

const handleNewEventButtonClick = () => {
  tripPresenter.createWayPoint(handleNewEventFormClose);
  addEventButtonElement.disabled = true;
};

addEventButtonElement.addEventListener('click', handleNewEventButtonClick);
addEventButtonElement.disabled = true;

tripPresenter.init();
filterPresenter.init();
wayPointsModel.init().finally(() => {
  addEventButtonElement.disabled = false;
});
