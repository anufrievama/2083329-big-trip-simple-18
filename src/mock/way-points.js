import { getRandomArrayElement, getRandomInteger } from '../utils.js';
import { COUNT_WAY_POINTS, Price, WAY_POINT_TYPES, DESTINATION_NAMES, UNIT_DATE } from './const.js';
import { generateRandomOfferIds } from './offers.js';
import dayjs from 'dayjs';

const generateWayPoint = (id) => ({
  id,
  basePrice: getRandomInteger(Price.MIN, Price.MAX),
  dateFrom: dayjs().subtract(getRandomInteger(), UNIT_DATE),
  dateTo: dayjs(),
  destination: getRandomInteger(1, DESTINATION_NAMES.length - 1),
  offers: [...new Set(generateRandomOfferIds())],
  type: getRandomArrayElement(WAY_POINT_TYPES),
});

const generateWayPoints = () => Array.from({ length: COUNT_WAY_POINTS }, (_value, index) => generateWayPoint(index + 1));

export { generateWayPoints };
