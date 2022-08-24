import AbstractView from '../framework/view/abstract-view';
import { WAY_POINT_TYPES, DEFAULT_WAY_POINT } from '../mock/const.js';
import { toUpperCaseFirstLetter, formatISOStringToDateTimeWithSlash, getLastWord } from '../utils.js';

const createEditFormTemplate = ({ type, basePrice, dateFrom, dateTo }, offers, offersIds, destination, allDestinations) => {

  const eventDateStart = formatISOStringToDateTimeWithSlash(dateFrom);
  const eventDateEnd = formatISOStringToDateTimeWithSlash(dateTo);

  const createEventTypeListTemplate = () => (WAY_POINT_TYPES.map((wayPointType) => {
    const checked = type === wayPointType ? 'checked' : '';
    return `<div class="event__type-item">
      <input id="event-type-${wayPointType}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${wayPointType}" ${checked}>
      <label class="event__type-label  event__type-label--${wayPointType}" for="event-type-${wayPointType}-1">${toUpperCaseFirstLetter(wayPointType)}</label>
    </div>`;
  }
  ).join(''));

  const createDestinationOptionsTemplate = () => (allDestinations.map((destinationItem) => (
    `<option value="${destinationItem.name}"></option>`
  )).join(''));


  const createOfferTemplate = () => (offers.map(({ id, title, price }) => {
    const nameOffer = getLastWord(title);
    const idOffer = `${nameOffer}-${id}`;
    const checked = offersIds.includes(id) ? 'checked' : '';
    return `<div class="event__offer-selector">
          <input class="event__offer-checkbox  visually-hidden" id="event-offer-${idOffer}" type="checkbox" name="event-offer-${nameOffer}" ${checked}>
            <label class="event__offer-label" for="event-${idOffer}">
              <span class="event__offer-title">${title}</span>
              &plus;&euro;&nbsp;
              <span class="event__offer-price">${price}</span>
            </label>
        </div>`;
  }
  ).join(''));


  const createPhotosTemplate = (pictures) => (pictures.map((picture) => (
    `<img class="event__photo" src="${picture.src}" alt="Event photo">`
  )).join(''));

  const createPhotosContainerTemplate = () =>
    'pictures' in destination
      ? `<div class="event__photos-container">
      <div class="event__photos-tape">
       ${createPhotosTemplate(destination.pictures)}
      </div>
    </div>`
      : '';

  const createDestinationsContainerTemplate = () =>
    destination !== null ?
      `<section class="event__section  event__section--destination">
          <h3 class="event__section-title  event__section-title--destination">Destination</h3>
          <p class="event__destination-description">${destination.description}</p>
          ${createPhotosContainerTemplate()}
        </section>`
      : '';

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
              ${createEventTypeListTemplate()}
            </fieldset>
          </div>
        </div>

        <div class="event__field-group  event__field-group--destination">
          <label class="event__label  event__type-output" for="event-destination-1">
            ${type}
          </label>
          <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${destination.name}" list="destination-list-1">
          <datalist id="destination-list-1">
          ${createDestinationOptionsTemplate()}
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
          <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${basePrice}">
        </div>

        <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
        <button class="event__reset-btn" type="reset">Delete</button>
        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </header>
      <section class="event__details">
        <section class="event__section  event__section--offers">
          <h3 class="event__section-title  event__section-title--offers">Offers</h3>

          <div class="event__available-offers">
            ${createOfferTemplate()}
          </div>
        </section>
        ${createDestinationsContainerTemplate()}
      </section>
    </form>
</li>`);
};

export default class EditFormView extends AbstractView {

  constructor(wayPoint = DEFAULT_WAY_POINT, offers = [], destination = null, allDestinations = []) {
    super();
    this.wayPoint = wayPoint;
    this.offers = offers;
    this.offersIds = wayPoint.offers;
    this.destination = destination;
    this.allDestinations = allDestinations;
  }

  get template() {
    return createEditFormTemplate(this.wayPoint, this.offers, this.offersIds, this.destination, this.allDestinations);
  }

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
    this._callback.formSubmit();
  };
}

