import { getRandomArrayElement, getRandomInteger } from '../utils.js';
import { COUNT_WAY_POINTS, Price, WAY_POINT_TYPES, DESTINATION_NAMES } from './const.js';
import { generateRandomOfferIds } from './offers.js';
import dayjs from 'dayjs';
import { nanoid } from 'nanoid';

const generateWayPoint = () => ({
  id: nanoid(),
  basePrice: getRandomInteger(Price.MIN, Price.MAX),
  dateFrom: new Date(dayjs().subtract(getRandomInteger(), 'hour')),
  dateTo: new Date(dayjs().add(getRandomInteger(), 'hour')),
  destination: getRandomInteger(1, DESTINATION_NAMES.length - 1),
  offers: [...new Set(generateRandomOfferIds())],
  type: getRandomArrayElement(WAY_POINT_TYPES),
});

const generateWayPoints = () => Array.from({ length: COUNT_WAY_POINTS }, () => generateWayPoint());

export { generateWayPoints };
