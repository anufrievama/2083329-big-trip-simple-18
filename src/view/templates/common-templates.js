import { WAYPOINT_TYPES } from '../../const';
import he from 'he';

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

export const createOffersContainerTemplate = (offersByType, wayPoint) =>
  `<section class="event__section  event__section--offers">
    <h3 class="event__section-title  event__section-title--offers">Offers</h3>
      <div class="event__available-offers">
        ${createOfferTemplate(offersByType, wayPoint)}
      </div>
  </section>`;

export const createEventTypeListTemplate = (type) => (WAYPOINT_TYPES.map((wayPointType) => {
  const checked = type === wayPointType ? 'checked' : '';
  return `<div class="event__type-item">
    <input id="event-type-${wayPointType}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${wayPointType}" ${checked}>
    <label class="event__type-label  event__type-label--${wayPointType}" for="event-type-${wayPointType}-1">${wayPointType}</label>
  </div>`;
}
).join(''));

export const createDestinationOptionsTemplate = (destinations) => (destinations.map((destinationItem) => (
  `<option value="${he.encode(destinationItem.name)}"></option>`
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

export const createDestinationsContainerTemplate = (foundDestination) =>
  `<section class="event__section  event__section--destination">
      <h3 class="event__section-title  event__section-title--destination">Destination</h3>
      <p class="event__destination-description">${he.encode(foundDestination.description)}</p>
      ${'pictures' in foundDestination ? createPhotosContainerTemplate(foundDestination) : ''}
    </section>`;
