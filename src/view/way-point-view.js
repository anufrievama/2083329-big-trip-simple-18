import { createElement } from '../render.js';
import { formatISOStringToMonthDay, formatISOStringToTime, formatISOStringToDate, formatISOStringToDateTime } from '../utils.js';

const createWayPointTemplate = ({ type, basePrice, dateFrom, dateTo }, offers, { name }) => {

  const eventDateStart = formatISOStringToMonthDay(dateFrom);
  const eventTimeStart = formatISOStringToTime(dateFrom);
  const eventTimeEnd = formatISOStringToTime(dateTo);
  const eventDay = formatISOStringToDate(dateFrom);
  const eventDateTimeStart = formatISOStringToDateTime(dateFrom);
  const eventDateTimeEnd = formatISOStringToDateTime(dateTo);

  const createOfferTemplate = () => {
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

  return (
    `<li class="trip-events__item">
  <div class="event">
    <time class="event__date" datetime=${eventDay}>${eventDateStart}</time>
    <div class="event__type">
      <img class="event__type-icon" width="42" height="42" src="img/icons/${type}.png" alt="Event type icon">
    </div>
    <h3 class="event__title">${type} ${name}</h3>
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
      ${createOfferTemplate()}
    </ul>
    <button class="event__rollup-btn" type="button">
      <span class="visually-hidden">Open event</span>
    </button>
  </div>
</li>`);
};

export default class WayPointView {
  constructor(wayPoint, offers, destination) {
    this.wayPoint = wayPoint;
    this.offers = offers;
    this.destination = destination;
  }

  getTemplate() {
    return createWayPointTemplate(this.wayPoint, this.offers, this.destination);
  }

  getElement() {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
    }
    return this.element;
  }
}
