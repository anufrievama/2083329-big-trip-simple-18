import { filter } from '../utils.js';

export const generateFilter = (wayPoints) => Object.entries(filter).map(
  ([filterName, filterWayPoints]) => ({
    name: filterName,
    noWayPoints: filterWayPoints(wayPoints).length === 0,
  }),
);
