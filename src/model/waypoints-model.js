import Observable from '../framework/observable.js';
import { UpdateType } from '../const.js';

export default class WayPointsModel extends Observable {
  #wayPoints = [];
  #offers = [];
  #destinations = [];
  #wayPointsApiService = null;

  constructor(wayPointsApiService) {
    super();
    this.#wayPointsApiService = wayPointsApiService;
  }

  get wayPoints() {
    return this.#wayPoints;
  }

  get destinations() {
    return this.#destinations;
  }

  get offers() {
    return this.#offers;
  }

  init = async () => {
    try {
      const wayPoints = await this.#wayPointsApiService.wayPoints;
      this.#wayPoints = wayPoints.map(this.#adaptToClient);
      this.#offers = await this.#wayPointsApiService.offers;
      this.#destinations = await this.#wayPointsApiService.destinations;
    } catch (err) {
      this.#wayPoints = [];
      this.#offers = [];
      this.#destinations = [];
    }
    this._notify(UpdateType.INIT);
  };

  updateWayPoint = async (updateType, update) => {
    const index = this.#wayPoints.findIndex((wayPoint) => wayPoint.id === update.id);
    if (index === -1) {
      throw new Error('Can\'t update unexisting waypoint');
    }
    try {
      const response = await this.#wayPointsApiService.updateWayPoint(update);
      const updatedWayPoint = this.#adaptToClient(response);
      this.#wayPoints = [
        ...this.#wayPoints.slice(0, index),
        updatedWayPoint,
        ...this.#wayPoints.slice(index + 1),
      ];
      this._notify(updateType, updatedWayPoint);
    } catch (err) {
      throw new Error('Can\'t update waypoint');
    }
  };

  addWayPoint = async (updateType, update) => {
    try {
      const response = await this.#wayPointsApiService.addWayPoint(update);
      const newWayPoint = this.#adaptToClient(response);
      this.#wayPoints = [newWayPoint, ...this.#wayPoints];
      this._notify(updateType, newWayPoint);
    } catch (err) {
      throw new Error('Can\'t add waypoint');
    }
  };

  deleteWayPoint = async (updateType, update) => {
    const index = this.#wayPoints.findIndex((wayPoint) => wayPoint.id === update.id);
    if (index === -1) {
      throw new Error('Can\'t delete unexisting waypoint');
    }
    try {
      await this.#wayPointsApiService.deleteWayPoint(update);
      this.#wayPoints = [
        ...this.#wayPoints.slice(0, index),
        ...this.#wayPoints.slice(index + 1),
      ];
      this._notify(updateType);
    } catch (err) {
      throw new Error('Can\'t delete waypoint');
    }
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

