import { Method } from './const.js';
import ApiService from './framework/api-service.js';

export default class WayPointsApiService extends ApiService {
  get wayPoints() {
    return this._load({ url: 'points' })
      .then(ApiService.parseResponse);
  }

  get destinations() {
    return this._load({ url: 'destinations' })
      .then(ApiService.parseResponse);
  }

  get offers() {
    return this._load({ url: 'offers' })
      .then(ApiService.parseResponse);
  }

  updateWayPoint = async (wayPoint) => {
    const response = await this._load({
      url: `points/${wayPoint.id}`,
      method: Method.PUT,
      body: JSON.stringify(this.#adaptToServer(wayPoint)),
      headers: new Headers({ 'Content-Type': 'application/json' }),
    });
    return ApiService.parseResponse(response);
  };

  addWayPoint = async (wayPoint) => {
    const response = await this._load({
      url: 'points',
      method: Method.POST,
      body: JSON.stringify(this.#adaptToServer(wayPoint)),
      headers: new Headers({ 'Content-Type': 'application/json' }),
    });
    return await ApiService.parseResponse(response);
  };

  deleteWayPoint = async (wayPoint) => await this._load({
    url: `points/${wayPoint.id}`,
    method: Method.DELETE,
  });

  #adaptToServer = (wayPoint) => {
    const adaptedWayPoint = {
      ...wayPoint,
      'base_price': wayPoint.basePrice,
      'date_from': wayPoint.dateFrom instanceof Date ? wayPoint.dateFrom.toISOString() : null,
      'date_to': wayPoint.dateTo instanceof Date ? wayPoint.dateTo.toISOString() : null,
      'is_favorite': wayPoint.isFavorite,
    };

    delete adaptedWayPoint.basePrice;
    delete adaptedWayPoint.dateFrom;
    delete adaptedWayPoint.dateTo;

    return adaptedWayPoint;
  };
}
