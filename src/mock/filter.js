import { filter } from '../utils.js';

export const generateFilter = (wayPoints) => Object.entries(filter).map(
  ([filterName, filterWayPoints]) => ({
    name: filterName,
    count: filterWayPoints(wayPoints).length,
  }),
);
