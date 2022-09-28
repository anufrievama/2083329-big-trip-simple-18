import AbstractView from '../framework/view/abstract-view';
import { formatStringToMonthDay, formatStringToTime, formatStringToDate, formatStringToDateTime } from '../utils.js';
import he from 'he';

const createOfferTemplate = (offers) => {
  if (offers.length === 0) {
    return ` <li class="event__offer">
              <span class="event__offer-title">No additional offers</span>
            </li>`;
  }
  return offers.map(({ title, price }) => (
    `<li class="event__offer">
      <span class="event__offer-title">${title}</span>
        &plus;&euro;&nbsp;
      <span class="event__offer-price">${price}</span>
    </li>`
  )).join('');
};

const createWayPointTemplate = (wayPoint, offers, destination) => {

  const { type, basePrice, dateFrom, dateTo } = wayPoint;
  const eventDateStart = formatStringToMonthDay(dateFrom);
  const eventTimeStart = formatStringToTime(dateFrom);
  const eventTimeEnd = formatStringToTime(dateTo);
  const eventDay = formatStringToDate(dateFrom);
  const eventDateTimeStart = formatStringToDateTime(dateFrom);
  const eventDateTimeEnd = formatStringToDateTime(dateTo);
  const destinationName = destination ? destination.name : '';

  return (
    `<li class="trip-events__item">
  <div class="event">
    <time class="event__date" datetime=${eventDay}>${eventDateStart}</time>
    <div class="event__type">
      <img class="event__type-icon" width="42" height="42" src="img/icons/${type}.png" alt="Event type icon">
    </div>
    <h3 class="event__title">${type} ${he.encode(destinationName)}</h3>
    <div class="event__schedule">
      <p class="event__time">
        <time class="event__start-time" datetime="${eventDateTimeStart}">${eventTimeStart}</time>
        &mdash;
        <time class="event__end-time" datetime="${eventDateTimeEnd}">${eventTimeEnd}</time>
      </p>
    </div>
    <p class="event__price">
      &euro;&nbsp;<span class="event__price-value">${basePrice}</span>
    </p>
    <h4 class="visually-hidden">Offers:</h4>
    <ul class="event__selected-offers">
      ${createOfferTemplate(offers)}
    </ul>
    <button class="event__rollup-btn" type="button">
      <span class="visually-hidden">Open event</span>
    </button>
  </div>
</li>`);
};

export default class WayPointView extends AbstractView {

  #wayPoint = null;
  #offers = null;
  #destination = null;

  constructor(wayPoint, offers, destination) {
    super();
    this.#wayPoint = wayPoint;
    this.#offers = offers;
    this.#destination = destination;
  }

  get template() {
    return createWayPointTemplate(this.#wayPoint, this.#offers, this.#destination);
  }

  setRollupClickHandler = (callback) => {
    this._callback.rollupClick = callback;
    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#rollupClickHandler);
  };

  #rollupClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.rollupClick();
  };
}
