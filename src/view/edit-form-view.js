import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import { WAY_POINT_TYPES } from '../const.js';
import { toUpperCaseFirstLetter, formatISOStringToDateTimeWithSlash, getLastWord, getDestinationById, getOffersByType } from '../utils.js';
import he from 'he';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

const createOfferTemplate = (offersByType, wayPoint) => (offersByType.map(({ price, title, id }) => {
  const nameOffer = getLastWord(title);
  const idOffer = `${nameOffer}-${id}`;
  const checked = wayPoint.offers.includes(id) ? 'checked' : '';
  const dataAttribute = `data-id-offer="${id}"`;
  return `<div class="event__offer-selector">
            <input class="event__offer-checkbox  visually-hidden" id="event-offer-${idOffer}" type="checkbox" name="event-offer-${nameOffer}"${checked}${dataAttribute}>
              <label class="event__offer-label" for="event-offer-${idOffer}">
                <span class="event__offer-title">${title}</span>
                &plus;&euro;&nbsp;
                <span class="event__offer-price">${price}</span>
              </label>
          </div>`;
}
).join(''));

const createEventTypeListTemplate = (type) => (WAY_POINT_TYPES.map((wayPointType) => {
  const checked = type === wayPointType ? 'checked' : '';
  return `<div class="event__type-item">
    <input id="event-type-${wayPointType}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${wayPointType}" ${checked}>
    <label class="event__type-label  event__type-label--${wayPointType}" for="event-type-${wayPointType}-1">${toUpperCaseFirstLetter(wayPointType)}</label>
  </div>`;
}
).join(''));

const createDestinationOptionsTemplate = (destinations) => (destinations.map((destinationItem) => (
  `<option value="${he.encode(destinationItem.name)}"></option>`
)).join(''));

const createPhotosTemplate = (pictures) => (pictures.map((picture) => (
  `<img class="event__photo" src="${picture.src}" alt="Event photo">`
)).join(''));


const createPhotosContainerTemplate = (foundDestination) =>
  'pictures' in foundDestination
    ? `<div class="event__photos-container">
  <div class="event__photos-tape">
   ${createPhotosTemplate(foundDestination.pictures)}
  </div>
</div>`
    : '';

const createDestinationsContainerTemplate = (foundDestination) =>
  'description' in foundDestination
    ? `<section class="event__section  event__section--destination">
      <h3 class="event__section-title  event__section-title--destination">Destination</h3>
      <p class="event__destination-description">${he.encode(foundDestination.description)}</p>
      ${createPhotosContainerTemplate(foundDestination)}
    </section>`
    : '';

const createEditFormTemplate = (wayPoint, destinations, offers,) => {

  const { type, basePrice, dateFrom, dateTo, destination, isDisabled, isSaving, isDeleting } = wayPoint;
  const eventDateStart = formatISOStringToDateTimeWithSlash(dateFrom);
  const eventDateEnd = formatISOStringToDateTimeWithSlash(dateTo);
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
          <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${destinationName}" list="destination-list-1">
          <datalist id="destination-list-1">
          ${createDestinationOptionsTemplate(destinations)}
          </datalist>
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
          <button class="event__save-btn  btn  btn--blue" type="submit">${isSaving ? 'Saving...' : 'Save'} ${isDisabled ? 'disabled' : ''}</button>
          <button class="event__reset-btn" type="reset">${isDeleting ? 'Deleting...' : 'Delete'} ${isDisabled ? 'disabled' : ''} </button>
          <button class="event__rollup-btn" type="button" ${isDisabled ? 'disabled' : ''}>
            <span class="visually-hidden">Open event</span>
        </button>
      </header>
      <section class="event__details">
        <section class="event__section  event__section--offers">
          <h3 class="event__section-title  event__section-title--offers">Offers</h3>

          <div class="event__available-offers">
            ${createOfferTemplate(offersByType, wayPoint)}
          </div>
        </section>
        ${createDestinationsContainerTemplate(foundDestination)}
      </section>
    </form>
</li>`);
};

export default class EditFormView extends AbstractStatefulView {

  #datepickerStart = null;
  #datepickerEnd = null;
  #destinations = null;
  #offers = null;

  constructor(wayPoint, destinations, offers) {
    super();
    this._state = EditFormView.parseWayPointToState(wayPoint);
    this.#destinations = destinations;
    this.#offers = offers;
    this.#setInnerHandlers();
    this.#setDatepickerStart();
    this.#setDatepickerEnd();
  }

  get template() {
    return createEditFormTemplate(this._state, this.#destinations, this.#offers);
  }

  static parseWayPointToState = (wayPoint) => ({
    ...wayPoint,
    isDisabled: false,
    isSaving: false,
    isDeleting: false
  });

  static parseStateToWayPoint = (state) => {
    const wayPoint = { ...state };
    delete wayPoint.isDisabled;
    delete wayPoint.isSaving;
    delete wayPoint.isDeleting;
    return wayPoint;
  };

  setRollupClickHandler = (callback) => {
    this._callback.rollupClick = callback;
    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#rollupClickHandler);
  };

  #rollupClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.rollupClick();
  };

  setFormSubmitHandler = (callback) => {
    this._callback.formSubmit = callback;
    this.element.querySelector('.event--edit').addEventListener('submit', this.#formSubmitHandler);
  };

  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    this._callback.formSubmit(EditFormView.parseStateToWayPoint(this._state));
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
    if (evt.target.value !== '') {
      this.updateElement({
        destination: this.#destinations.find((destination) => evt.target.value === destination.name).id,
      });
    }
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
    this.setRollupClickHandler(this._callback.rollupClick);
    this.setDeleteClickHandler(this._callback.deleteClick);
    this.#setDatepickerStart();
    this.#setDatepickerEnd();
  };

  #setDatepickerStart = () => {
    this.#datepickerStart = flatpickr(
      this.element.querySelector('#event-start-time-1'),
      {
        enableTime: true,
        'time_24hr': true,
        dateFormat: 'd/m/y H:i',
        maxDate: this._state.dateTo,
        onChange: this.#eventDateStartHandler,
      },
    );
  };

  #setDatepickerEnd = () => {
    this.#datepickerEnd = flatpickr(
      this.element.querySelector('#event-end-time-1'),
      {
        enableTime: true,
        'time_24hr': true,
        dateFormat: 'd/m/y H:i',
        minDate: this._state.dateFrom,
        onChange: this.#eventDateEndHandler,
      },
    );
  };

  #eventDateStartHandler = ([userDate]) => {
    this.updateElement({
      dateFrom: userDate,
    });
  };

  #eventDateEndHandler = ([userDate]) => {
    this.updateElement({
      dateTo: userDate,
    });
  };

  #setInnerHandlers = () => {
    this.element.querySelector('.event__type-group').addEventListener('change', this.#eventTypeHandler);
    this.element.querySelector('.event__input--destination').addEventListener('change', this.#eventDestinationHandler);
    this.element.querySelector('.event__input--price').addEventListener('change', this.#eventPriceHandler);
    this.element.querySelector('.event__available-offers').addEventListener('change', this.#eventOfferHandler);
  };

  setDeleteClickHandler = (callback) => {
    this._callback.deleteClick = callback;
    this.element.querySelector('.event__reset-btn').addEventListener('click', this.#eventDeleteClickHandler);
  };

  #eventDeleteClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.deleteClick(EditFormView.parseStateToWayPoint(this._state));
  };

  reset = (wayPoint) => {
    this.updateElement(
      EditFormView.parseWayPointToState(wayPoint),
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
