import { generateWayPoints } from '../mock/way-points.js';
import { generateOffers } from '../mock/offers.js';
import { generateDestinations } from '../mock/destination.js';

export default class WayPointsModel {
  #wayPoints = generateWayPoints();
  #allOffers = generateOffers();
  #allDestinations = generateDestinations();

  get wayPoints() {
    return this.#wayPoints;
  }

  get allOffers() {
    return this.#allOffers;
  }

  get allDestinations() {
    return this.#allDestinations;
  }

  getOffersByType = (wayPoint) => this.#allOffers.filter((offer) => wayPoint.type === offer.type);
  getOffers = (wayPoint) => this.getOffersByType(wayPoint).filter((offer) => wayPoint.offers.includes(offer.id));
  getDestination = (wayPoint) => this.allDestinations.find((destination) => destination.id === wayPoint.destination);

}
