import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import { formatStringToFormDateTime, getDestinationById, getOffersByType, getIdByDestinationName } from '../utils.js';
import { createOffersContainerTemplate, createTypeListTemplate, createDestinationOptionsTemplate, createDestinationsContainerTemplate } from './templates/common-templates.js';
import { BLANK_WAYPOINT, BLANK_DESTINATION } from '../const.js';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

const createEditFormTemplate = (wayPoint, destinations, offers,) => {

  const { type, basePrice, dateFrom, dateTo, destination, isDisabled, isSaving, isDeleting } = wayPoint;
  const startDate = formatStringToFormDateTime(dateFrom);
  const endDate = formatStringToFormDateTime(dateTo);
  const destinationById = destination !== BLANK_WAYPOINT.destination ? getDestinationById(destination, destinations) : BLANK_DESTINATION;
  const offersByType = getOffersByType(type, offers);

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
              ${createTypeListTemplate(type)}
            </fieldset>
          </div>
        </div>

        <div class="event__field-group  event__field-group--destination">
          <label class="event__label  event__type-output" for="event-destination-1">
            ${type}
         </label>
         <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${destinationById.name}" list="destination-list-1" ${isDisabled ? 'disabled' : ''}>
          <datalist id="destination-list-1">
            ${createDestinationOptionsTemplate(destinations)}
          </datalist>
       </div>

      <div class="event__field-group  event__field-group--time">
        <label class="visually-hidden" for="event-start-time-1">From</label>
        <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${startDate}" ${isDisabled ? 'disabled' : ''}>
          &mdash;
        <label class="visually-hidden" for="event-end-time-1">To</label>
        <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${endDate}" ${isDisabled ? 'disabled' : ''}>
      </div>

        <div class="event__field-group  event__field-group--price">
          <label class="event__label" for="event-price-1">
            <span class="visually-hidden">Price</span>
            &euro;
          </label>
          <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${basePrice !== 0 ? basePrice : ''}" ${isDisabled ? 'disabled' : ''}>
        </div>
          <button class="event__save-btn  btn  btn--blue" type="submit" ${isDisabled ? 'disabled' : ''}>${isSaving ? 'Saving...' : 'Save'}</button>
          <button class="event__reset-btn" type="reset" ${isDisabled ? 'disabled' : ''}>${isDeleting ? 'Deleting...' : 'Delete'}</button>
          <button class="event__rollup-btn" type="button" ${isDisabled ? 'disabled' : ''}>
            <span class="visually-hidden">Open event</span>
        </button>
      </header>
      <section class="event__details">
        ${offersByType.length !== 0 ? createOffersContainerTemplate(offersByType, wayPoint) : ''}
        ${destinationById !== BLANK_DESTINATION ? createDestinationsContainerTemplate(destinationById) : ''}
      </section>
    </form>
</li>`);
};

export default class EditFormView extends AbstractStatefulView {

  #datepickerStart = null;
  #datepickerEnd = null;
  #destinations = null;
  #destinationNames = null;
  #offers = null;

  constructor(wayPoint, destinations, offers) {
    super();
    this._state = EditFormView.parseWayPointToState(wayPoint);
    this.#destinations = destinations;
    this.#destinationNames = destinations.map((destination) => destination.name);
    this.#offers = offers;
    this.#setInnerHandlers();
    this.#setStartDate();
    this.#setEndDate();
  }

  get template() {
    return createEditFormTemplate(this._state, this.#destinations, this.#offers);
  }

  setRollupClickHandler = (callback) => {
    this._callback.rollupClick = callback;
    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#rollupClickHandler);
  };

  setFormSubmitHandler = (callback) => {
    this._callback.formSubmit = callback;
    this.element.querySelector('.event--edit').addEventListener('submit', this.#formSubmitHandler);
  };

  setDeleteClickHandler = (callback) => {
    this._callback.deleteClick = callback;
    this.element.querySelector('.event__reset-btn').addEventListener('click', this.#deleteClickHandler);
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

  _restoreHandlers = () => {
    this.#setInnerHandlers();
    this.setFormSubmitHandler(this._callback.formSubmit);
    this.setRollupClickHandler(this._callback.rollupClick);
    this.setDeleteClickHandler(this._callback.deleteClick);
    this.#setStartDate();
    this.#setEndDate();
  };

  #setInnerHandlers = () => {
    this.element.querySelector('.event__type-group').addEventListener('change', this.#typeChangeHandler);
    this.element.querySelector('.event__input--destination').addEventListener('change', this.#destinationChangeHandler);
    this.element.querySelector('.event__input--price').addEventListener('change', this.#priceChangeHandler);
    if (this.element.querySelector('.event__available-offers')) {
      this.element.querySelector('.event__available-offers').addEventListener('change', this.#offerChangeHandler);
    }
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

  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    this._callback.formSubmit(EditFormView.parseStateToWayPoint(this._state));
  };

  #typeChangeHandler = (evt) => {
    evt.preventDefault();
    this.updateElement({
      type: evt.target.value,
      offers: [],
    });
  };

  #destinationChangeHandler = (evt) => {
    evt.preventDefault();
    this.updateElement({
      destination: this.#destinationNames.includes(evt.target.value)
        ? getIdByDestinationName(evt.target.value, this.#destinations)
        : BLANK_WAYPOINT.destination,
    });
  };

  #priceChangeHandler = (evt) => {
    evt.preventDefault();
    this._setState({
      basePrice: /^[0-9]+$/.test(evt.target.value) ? Number(evt.target.value) : BLANK_WAYPOINT.basePrice,
    });
  };

  #offerChangeHandler = (evt) => {
    evt.preventDefault();
    this.updateElement({
      offers: Array.from(this.element.querySelector('.event__available-offers')
        .querySelectorAll('input[type="checkbox"]:checked'))
        .map((nodeItem) => Number(nodeItem.dataset.idOffer)),
    });
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

  #deleteClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.deleteClick(EditFormView.parseStateToWayPoint(this._state));
  };

  #rollupClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.rollupClick();
  };

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
}
