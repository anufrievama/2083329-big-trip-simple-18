import Observable from '../framework/observable.js';
import { generateWayPoints } from '../mock/waypoints.js';
import { generateOffers } from '../mock/offers.js';
import { generateDestinations } from '../mock/destination.js';

export default class WayPointsModel extends Observable {
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

  updateWayPoint = (updateType, update) => {
    const index = this.#wayPoints.findIndex((point) => point.id === update.id);
    if (index === -1) {
      throw new Error('Can\'t update unexisting waypoint');
    }
    this.#wayPoints = [
      ...this.#wayPoints.slice(0, index),
      update,
      ...this.#wayPoints.slice(index + 1),
    ];
    this._notify(updateType, update);
  };

  addWayPoint = (updateType, update) => {
    this.#wayPoints = [
      update,
      ...this.#wayPoints,
    ];
    this._notify(updateType, update);
  };

  deleteWayPoint = (updateType, update) => {
    const index = this.#wayPoints.findIndex((point) => point.id === update.id);
    if (index === -1) {
      throw new Error('Can\'t delete unexisting waypoint');
    }
    this.#wayPoints = [
      ...this.#wayPoints.slice(0, index),
      ...this.#wayPoints(index + 1),
    ];
    this._notify(updateType, update);
  };
}

