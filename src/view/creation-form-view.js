import AbstractView from '../framework/view/abstract-view';
import { WAY_POINT_TYPES } from '../mock/const.js';
import { toUpperCaseFirstLetter, getLastWord } from '../utils.js';

const createCreationFormTemplate = (allOffers, allDestinations) => {

  const createEventTypeListTemplate = () => (WAY_POINT_TYPES.map((wayPointType) => `<div class="event__type-item">
      <input id="event-type-${wayPointType}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${wayPointType}">
      <label class="event__type-label  event__type-label--${wayPointType}" for="event-type-${wayPointType}-1">${toUpperCaseFirstLetter(wayPointType)}</label>
    </div>`
  ).join(''));

  const defaultTypeWayPoint = WAY_POINT_TYPES[0];

  const createDestinationOptionsTemplate = () => (allDestinations.map((destination) => (
    `<option value="${destination.name}"></option>`
  )).join(''));

  const createOfferTemplate = () => {
    const offersByDefaultType = allOffers.filter((offer) => defaultTypeWayPoint === offer.type);
    return offersByDefaultType.map(({ id, title, price }) => {
      const nameOffer = getLastWord(title);
      const idOffer = `${nameOffer}-${id}`;
      return `<div class="event__offer-selector">
        <input class="event__offer-checkbox  visually-hidden" id="event-offer-${idOffer}" type="checkbox" name="event-offer-${nameOffer}">
          <label class="event__offer-label" for="event-${idOffer}">
            <span class="event__offer-title">${title}</span>
            &plus;&euro;&nbsp;
            <span class="event__offer-price">${price}</span>
          </label>
      </div>`;
    }
    ).join('');
  };

  return `<li class="trip-events__item">
  <form class="event event--edit" action="#" method="post">
    <header class="event__header">
      <div class="event__type-wrapper">
        <label class="event__type  event__type-btn" for="event-type-toggle-1">
          <span class="visually-hidden">Choose event type</span>
          <img class="event__type-icon" width="17" height="17" src="img/icons/${defaultTypeWayPoint}.png" alt="Event type icon">
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
        ${defaultTypeWayPoint}
        </label>
        <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="" list="destination-list-1">
        <datalist id="destination-list-1">
          ${createDestinationOptionsTemplate()}
        </datalist>
      </div>

      <div class="event__field-group  event__field-group--time">
        <label class="visually-hidden" for="event-start-time-1">From</label>
        <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="">
        &mdash;
        <label class="visually-hidden" for="event-end-time-1">To</label>
        <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="">
      </div>

      <div class="event__field-group  event__field-group--price">
        <label class="event__label" for="event-price-1">
          <span class="visually-hidden">Price</span>
          &euro;
        </label>
        <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="">
      </div>

      <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
      <button class="event__reset-btn" type="reset">Cancel</button>
    </header>
    <section class="event__details">
      <section class="event__section  event__section--offers">
        <h3 class="event__section-title  event__section-title--offers">Offers</h3>
        <div class="event__available-offers">
        ${createOfferTemplate()}
        </div>
      </section>

      <section class="event__section  event__section--destination visually-hidden">
        <h3 class="event__section-title  event__section-title--destination">Destination</h3>
        <div class="event__photos-container">
          <div class="event__photos-tape">
          </div>
        </div>
      </section>
    </section>
  </form>
</li>`;
};

export default class CreationFormView extends AbstractView {

  #alloffers = null;
  #allDestinations = null;

  constructor(alloffers, allDestinations) {
    super();
    this.#alloffers = alloffers;
    this.#allDestinations = allDestinations;
  }

  get template() {
    return createCreationFormTemplate(this.#alloffers, this.#allDestinations);
  }

}
