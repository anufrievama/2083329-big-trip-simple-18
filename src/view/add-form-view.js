import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import { WAY_POINT_TYPES } from '../const.js';
import { formatStringToDateTimeSlash, getDestinationById, getOffersByType, getIdByDestinationName } from '../utils.js';
import he from 'he';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

const createOfferTemplate = (offersByType, wayPoint) => (offersByType.map(({ price, title, id }) => {
  const checked = wayPoint.offers.includes(id) ? 'checked' : '';
  const dataAttribute = `data-id-offer="${id}"`;
  return `<div class="event__offer-selector">
   <input class="event__offer-checkbox  visually-hidden" id="event-offer-${id}" type="checkbox" name="event-offer-${id}" ${checked} ${dataAttribute}>
     <label class="event__offer-label" for="event-offer-${id}">
      <span class="event__offer-title">${title}</span>
        &plus;&euro;&nbsp;
      <span class="event__offer-price">${price}</span>
    </label>
  </div>`;
}
).join(''));

const createOffersContainerTemplate = (offersByType, wayPoint) =>
  `<section class="event__section  event__section--offers">
    <h3 class="event__section-title  event__section-title--offers">Offers</h3>
      <div class="event__available-offers">
        ${createOfferTemplate(offersByType, wayPoint)}
      </div>
  </section>`;

const createEventTypeListTemplate = (type) => (WAY_POINT_TYPES.map((wayPointType) => {
  const checked = type === wayPointType ? 'checked' : '';
  return `<div class="event__type-item">
    <input id="event-type-${wayPointType}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${wayPointType}" ${checked}>
    <label class="event__type-label  event__type-label--${wayPointType}" for="event-type-${wayPointType}-1">${wayPointType}</label>
  </div>`;
}
).join(''));

const createDestinationOptionsTemplate = (destinations, destinationName) => (destinations.map((destinationItem) => (
  `<option value="${destinationItem.name}" ${destinationItem.name === destinationName ? 'selected' : ''}>${he.encode(destinationItem.name)}</option>`
)).join(''));

const createPhotosTemplate = (pictures) => (pictures.map((picture) => (
  `<img class="event__photo" src="${picture.src}" alt="Event photo">`
)).join(''));

const createPhotosContainerTemplate = (foundDestination) =>
  `<div class="event__photos-container">
    <div class="event__photos-tape">
     ${createPhotosTemplate(foundDestination.pictures)}
    </div>
  </div>`;

const createDestinationsContainerTemplate = (foundDestination) =>
  `<section class="event__section  event__section--destination">
      <h3 class="event__section-title  event__section-title--destination">Destination</h3>
      <p class="event__destination-description">${he.encode(foundDestination.description)}</p>
      ${'pictures' in foundDestination ? createPhotosContainerTemplate(foundDestination) : ''}
    </section>`;

const createAddFormTemplate = (wayPoint, destinations, offers) => {

  const { type, basePrice, dateFrom, dateTo, destination, isDisabled, isSaving } = wayPoint;
  const eventDateStart = formatStringToDateTimeSlash(dateFrom);
  const eventDateEnd = formatStringToDateTimeSlash(dateTo);
  const foundDestination = destination !== null ? getDestinationById(destination, destinations) : {};
  const offersByType = getOffersByType(type, offers);
  const destinationName = 'name' in foundDestination ? foundDestination.name : '';

  return (
    `<li class="trip-events__item">
    <form class="event event--edit" action="#" method="post">
      <header class="event__header">
        <div class="event__type-wrapper">
          <label class="event__type  event__type-btn" for="event-type-toggle-1">
            <span class="visually-hidden">Choose event type</span>
            <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
          </label>
          <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

          <div class="event__type-list">
            <fieldset class="event__type-group">
              <legend class="visually-hidden">Event type</legend>
              ${createEventTypeListTemplate(type)}
            </fieldset>
          </div>
        </div>

        <div class="event__field-group  event__field-group--destination">
          <label class="event__label  event__type-output" for="event-destination-1">
            ${type}
          </label>
          <select class="event__input  event__input--destination" id="event-destination-1" name="event-destination">
            ${createDestinationOptionsTemplate(destinations, destinationName)}
          </select>
        </div>

        <div class="event__field-group  event__field-group--time">
          <label class="visually-hidden" for="event-start-time-1">From</label>
          <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${eventDateStart}">
          &mdash;
          <label class="visually-hidden" for="event-end-time-1">To</label>
          <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${eventDateEnd}">
        </div>

        <div class="event__field-group  event__field-group--price">
          <label class="event__label" for="event-price-1">
            <span class="visually-hidden">Price</span>
            &euro;
          </label>
          <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" pattern ='^[0-9]+$' value="${basePrice === 0 ? '' : basePrice}">
        </div>
          <button class="event__save-btn  btn  btn--blue" type="submit" ${isDisabled ? 'disabled' : ''}>${isSaving ? 'Saving...' : 'Save'}</button>
          <button class="event__reset-btn" type="reset" ${isDisabled ? 'disabled' : ''}>Cancel</button>
      </header>
      <section class="event__details">
        ${offersByType.length !== 0 ? createOffersContainerTemplate(offersByType, wayPoint) : ''}
        ${'description' in foundDestination ? createDestinationsContainerTemplate(foundDestination) : ''}
      </section>
    </form>
</li>`);
};

export default class AddFormView extends AbstractStatefulView {

  #datepickerStart = null;
  #datepickerEnd = null;
  #destinations = null;
  #offers = null;

  constructor(wayPoint, destinations, offers) {
    super();
    this._state = AddFormView.parseWayPointToState(wayPoint);
    this.#destinations = destinations;
    this.#offers = offers;
    this.#setInnerHandlers();
    this.#setStartDate();
    this.#setEndDate();
  }

  get template() {
    return createAddFormTemplate(this._state, this.#destinations, this.#offers);
  }

  static parseWayPointToState = (wayPoint) => ({
    ...wayPoint,
    isDisabled: false,
    isSaving: false,
  });

  static parseStateToWayPoint = (state) => {
    const wayPoint = { ...state };
    delete wayPoint.isDisabled;
    delete wayPoint.isSaving;
    return wayPoint;
  };

  setFormSubmitHandler = (callback) => {
    this._callback.formSubmit = callback;
    this.element.querySelector('.event--edit').addEventListener('submit', this.#formSubmitHandler);
  };

  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    this._callback.formSubmit(AddFormView.parseStateToWayPoint(this._state));
  };

  #eventTypeHandler = (evt) => {
    evt.preventDefault();
    this.updateElement({
      type: evt.target.value,
      offers: [],
    });
  };

  #eventDestinationHandler = (evt) => {
    evt.preventDefault();
    this.updateElement({
      destination: getIdByDestinationName(evt.target.value, this.#destinations),
    });
  };

  #eventPriceHandler = (evt) => {
    evt.preventDefault();
    this._setState({
      basePrice: Number(evt.target.value),
    });
  };

  #eventOfferHandler = (evt) => {
    evt.preventDefault();
    this.updateElement({
      offers: Array.from(this.element.querySelector('.event__available-offers')
        .querySelectorAll('input[type="checkbox"]:checked'))
        .map((nodeItem) => Number(nodeItem.dataset.idOffer)),
    });
  };

  _restoreHandlers = () => {
    this.#setInnerHandlers();
    this.setFormSubmitHandler(this._callback.formSubmit);
    this.setCancelClickHandler(this._callback.cancelClick);
    this.#setStartDate();
    this.#setEndDate();
  };

  #setStartDate = () => {
    this.#datepickerStart = flatpickr(
      this.element.querySelector('#event-start-time-1'),
      {
        enableTime: true,
        'time_24hr': true,
        dateFormat: 'd/m/y H:i',
        maxDate: this._state.dateTo,
        onClose: this.#startDateCloseHandler,
      },
    );
  };

  #setEndDate = () => {
    this.#datepickerEnd = flatpickr(
      this.element.querySelector('#event-end-time-1'),
      {
        enableTime: true,
        'time_24hr': true,
        dateFormat: 'd/m/y H:i',
        minDate: this._state.dateFrom,
        onClose: this.#endDateCloseHandler,
      },
    );
  };

  #startDateCloseHandler = ([userDate]) => {
    this.updateElement({
      dateFrom: userDate,
    });
  };

  #endDateCloseHandler = ([userDate]) => {
    this.updateElement({
      dateTo: userDate,
    });
  };

  #setInnerHandlers = () => {
    this.element.querySelector('.event__type-group').addEventListener('change', this.#eventTypeHandler);
    this.element.querySelector('.event__input--destination').addEventListener('change', this.#eventDestinationHandler);
    this.element.querySelector('.event__input--price').addEventListener('change', this.#eventPriceHandler);
    const availableOffersElement = this.element.querySelector('.event__available-offers');
    if (availableOffersElement !== null) {
      availableOffersElement.addEventListener('change', this.#eventOfferHandler);
    }
  };

  setCancelClickHandler = (callback) => {
    this._callback.cancelClick = callback;
    this.element.querySelector('.event__reset-btn').addEventListener('click', this.#eventCancelClickHandler);
  };

  #eventCancelClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.cancelClick(AddFormView.parseStateToWayPoint(this._state));
  };

  reset = (wayPoint) => {
    this.updateElement(
      AddFormView.parseWayPointToState(wayPoint),
    );
  };

  removeElement = () => {
    super.removeElement();

    if (this.#datepickerStart) {
      this.#datepickerStart.destroy();
      this.#datepickerStart = null;
    }

    if (this.#datepickerEnd) {
      this.#datepickerEnd.destroy();
      this.#datepickerEnd = null;
    }
  };
}

export { createOffersContainerTemplate, createEventTypeListTemplate, createDestinationOptionsTemplate, createDestinationsContainerTemplate };
