import WayPointListView from '../view/way-point-list-view.js';
import WayPointView from '../view/way-point-view.js';
import EditFormView from '../view/edit-form-view.js';
import CreationFormView from '../view/creation-form-view.js';
import { render } from '../render.js';

export default class EventsPresenter {
  wayPointListComponent = new WayPointListView();

  init = (eventsContainer, wayPointsModel) => {

    this.eventsContainer = eventsContainer;
    this.wayPointsModel = wayPointsModel;
    this.wayPoints = this.wayPointsModel.getWayPoints();

    render(this.wayPointListComponent, this.eventsContainer);
    render(new EditFormView(this.wayPoints[0],
      this.wayPointsModel.getOffersByType(this.wayPoints[0]),
      this.wayPointsModel.getDestination(this.wayPoints[0]),
      this.wayPointsModel.allDestinations),
    this.wayPointListComponent.getElement());
    render(new CreationFormView(this.wayPointsModel.allOffers, this.wayPointsModel.allDestinations),this.wayPointListComponent.getElement());

    for (let i = 0; i < this.wayPoints.length; i++) {
      render(new WayPointView(
        this.wayPoints[i],
        this.wayPointsModel.getOffers(this.wayPoints[i]),
        this.wayPointsModel.getDestination(this.wayPoints[i])
      ), this.wayPointListComponent.getElement());
    }
  };
}
