import { generateWayPoints } from '../mock/waypoints.js';
import { generateOffers } from '../mock/offers.js';
import { generateDestinations } from '../mock/destination.js';

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
}
