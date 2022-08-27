const COUNT_WAY_POINTS = 10;
const URL_IMAGE = 'http://picsum.photos/248/152?r=';
const UNIT_DATE = 'minute';
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
  id: 0,
  basePrice: 0,
  dateFrom: null,
  dateTo: null,
  destination: null,
  offers: [],
  type: WAY_POINT_TYPES[0],
};

const Price = {
  MIN: 10,
  MAX: 1000,
};

const CountPictures = {
  MIN: 1,
  MAX: 5,
};

const OFFER_TITLES = [
  'add luggage',
  'switch to comfort class',
  'add meal',
  'choose seats',
  'add breakfast',
  'book tickets',
];

const DESTINATION_NAMES = [
  'Chamonix',
  'Geneva',
  'Amsterdam',
  'Prague',
  'Bruges',
  'Brussels',
  'Paris',
  'London',
  'Rome',
  'Sofia',
];

const DESTINATION_DESCRIPTIONS = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna,
non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra.
Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. Phasellus eros mauris, condimentum sed nibh vitae,
sodales efficitur ipsum. Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. Sed
sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. In rutrum
ac purus sit amet tempus.`.split('. ');

const FilterType = {
  EVERYTHING: 'everything',
  FUTURE: 'future'
};

const SortTypes = ['day','event','time', 'price','offers'];

export {
  COUNT_WAY_POINTS,
  URL_IMAGE, UNIT_DATE,
  WAY_POINT_TYPES,
  DEFAULT_WAY_POINT,
  OFFER_TITLES,
  DESTINATION_NAMES,
  DESTINATION_DESCRIPTIONS,
  Price,
  CountPictures,
  FilterType,
  SortTypes
};
