import { WAYPOINT_TYPES } from '../../const';
import he from 'he';

const createOfferTemplate = (offersByType, wayPoint) => (offersByType.map(({ price, title, id }) => {
  const dataAttribute = `data-id-offer="${id}"`;
  return `<div class="event__offer-selector">
   <input class="event__offer-checkbox  visually-hidden" id="event-offer-${id}" type="checkbox" name="event-offer-${id}"
   ${wayPoint.offers.includes(id) ? 'checked' : ''}
   ${dataAttribute}>
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

export const createTypeListTemplate = (type) => (WAYPOINT_TYPES.map((wayPointType) =>
  `<div class="event__type-item">
    <input id="event-type-${wayPointType}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${wayPointType}"
    ${type === wayPointType ? 'checked' : ''}>
    <label class="event__type-label  event__type-label--${wayPointType}" for="event-type-${wayPointType}-1">${wayPointType}</label>
  </div>`
).join(''));

export const createDestinationOptionsTemplate = (destinations) => (destinations.map((destinationItem) => (
  `<option value="${he.encode(destinationItem.name)}"></option>`
)).join(''));

const createPhotosTemplate = (pictures) => (pictures.map((picture) => (
  `<img class="event__photo" src="${picture.src}" alt="Event photo">`
)).join(''));

const createPhotosContainerTemplate = (destination) =>
  `<div class="event__photos-container">
    <div class="event__photos-tape">
     ${createPhotosTemplate(destination.pictures)}
    </div>
  </div>`;

export const createDestinationsContainerTemplate = (destination) =>
  `<section class="event__section  event__section--destination">
      <h3 class="event__section-title  event__section-title--destination">Destination</h3>
      <p class="event__destination-description">${he.encode(destination.description)}</p>
      ${'pictures' in destination ? createPhotosContainerTemplate(destination) : ''}
    </section>`;
