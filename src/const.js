const WAYPOINT_TYPES = [
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

const BLANK_WAYPOINT = {
  basePrice: 0,
  dateFrom: new Date,
  dateTo: new Date,
  destination: null,
  offers: [],
  type: WAYPOINT_TYPES[0],
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

const TimeLimit = {
  LOWER_LIMIT: 350,
  UPPER_LIMIT: 1000,
};

const AUTHORIZATION = 'Basic jdn56le3hYJkf89';

const END_POINT = 'https://18.ecmascript.pages.academy/big-trip';

export {
  WAYPOINT_TYPES,
  BLANK_WAYPOINT,
  UNIT_DATE,
  FilterType,
  SortType,
  Mode,
  UserAction,
  UpdateType,
  TimeLimit,
  AUTHORIZATION,
  END_POINT
};
