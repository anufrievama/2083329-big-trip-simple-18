import { generateWayPoints } from '../mock/waypoints.js';
import { generateOffers } from '../mock/offers.js';
import { generateDestinations } from '../mock/destination.js';
import { getOffersByType, getDestinationById } from '../utils.js';

export default class WayPointsModel {
  #wayPoints = generateWayPoints();
  #allOffers = generateOffers();
  #allDestinations = generateDestinations();

  get wayPoints() {
    return this.#wayPoints;
  }

  get allDestinations() {
    return this.#allDestinations;
  }

  get allOffers() {
    return this.#allOffers;
  }

  getOffers = (wayPoint) => getOffersByType(wayPoint.type, this.#allOffers).filter((offer) => wayPoint.offers.includes(offer.id));
  getDestination = (wayPoint) => getDestinationById(wayPoint.destination, this.#allDestinations);

}
