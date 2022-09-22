import Observable from '../framework/observable.js';
import { generateWayPoints } from '../mock/waypoints.js';
import { generateOffers } from '../mock/offers.js';
import { generateDestinations } from '../mock/destination.js';

export default class WayPointsModel extends Observable {
  #wayPoints = generateWayPoints();
  #allOffers = generateOffers();
  #allDestinations = generateDestinations();
  #wayPointsApiService = null;

  constructor(wayPointsApiService) {
    super();
    this.#wayPointsApiService = wayPointsApiService;
    this.#wayPointsApiService.points.then((points) => {
      console.log(points.map(this.#adaptToClient));
    });
  }

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
    const index = this.#wayPoints.findIndex((wayPoint) => wayPoint.id === update.id);
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
    const index = this.#wayPoints.findIndex((wayPoint) => wayPoint.id === update.id);
    if (index === -1) {
      throw new Error('Can\'t delete unexisting waypoint');
    }
    this.#wayPoints = [
      ...this.#wayPoints.slice(0, index),
      ...this.#wayPoints.slice(index + 1),
    ];
    this._notify(updateType, update);
  };

  #adaptToClient = (wayPoint) => {
    const adaptedWayPoint = {
      ...wayPoint,
      basePrice: wayPoint['base_price'],
      dateFrom: wayPoint['date_from'] !== null ? new Date(wayPoint['date_from']) : wayPoint['date_from'],
      dateTo: wayPoint['date_to'] !== null ? new Date(wayPoint['date_to']) : wayPoint['date_to'],
      isFavorite: wayPoint['is_favorite'],
    };

    delete adaptedWayPoint['base_price'];
    delete adaptedWayPoint['date_from'];
    delete adaptedWayPoint['date_to'];
    delete adaptedWayPoint['is_favorite'];
    return adaptedWayPoint;
  };
}

