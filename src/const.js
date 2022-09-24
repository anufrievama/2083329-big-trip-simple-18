const WAY_POINT_TYPES = [
  'taxi',
  'bus',
  'train',
  'ship',
  'drive',
  'flight',
  'check-in',
  'sightseeing',
  'restaurant',
];

const DEFAULT_WAY_POINT = {
  id: null,
  basePrice: 0,
  dateFrom: null,
  dateTo: null,
  destination: null,
  offers: [],
  type: WAY_POINT_TYPES[0],
};

const FilterType = {
  EVERYTHING: 'Everything',
  FUTURE: 'Future'
};

const SortType = {
  DAY: 'day',
  PRICE: 'price',
};

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING'
};

const UserAction = {
  UPDATE_WAYPOINT: 'UPDATE_WAYPOINT',
  ADD_WAYPOINT: 'ADD_WAYPOINT',
  DELETE_WAYPOINT: 'DELETE_WAYPOINT',
};

const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
  INIT: 'INIT',
};

const UNIT_DATE = 'minute';

export {
  WAY_POINT_TYPES,
  DEFAULT_WAY_POINT,
  UNIT_DATE,
  FilterType,
  SortType,
  Mode,
  UserAction,
  UpdateType
};
