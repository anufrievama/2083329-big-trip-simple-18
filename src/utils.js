import dayjs from 'dayjs';
import { UNIT_DATE } from './mock/const.js';
import { FilterType } from './mock/const.js';

const isFutureDate = (dateStart, dateEnd) => dayjs().isBefore(dayjs(dateStart), UNIT_DATE) || dayjs().isBefore(dayjs(dateEnd), UNIT_DATE);

const filter = {
  [FilterType.EVERYTHING]: (wayPoints) => wayPoints,
  [FilterType.FUTURE]: (wayPoints) => wayPoints.filter((wayPoint) => isFutureDate(wayPoint.dateTo, wayPoint.dateFrom)),
};

const getRandomInteger = (min = 1, max = 1000) => {
  const minNumber = Math.min(Math.abs(min), Math.abs(max));
  const maxNumber = Math.max(Math.abs(min), Math.abs(max));
  return Math.floor(minNumber + Math.random() * (maxNumber - minNumber + 1));
};

const toUpperCaseFirstLetter = (string) => string[0].toUpperCase() + string.slice(1);

const getRandomArrayElement = (elements) => elements[getRandomInteger(0, elements.length - 1)];

const formatISOStringToMonthDay = (date) => date === null ? '' : dayjs(date).format('MMM D');

const formatISOStringToTime = (date) => date === null ? '' : dayjs(date).format('HH:mm');

const formatISOStringToDate = (date) => date === null ? '' : dayjs(date).format('YYYY-MM-DD');

const formatISOStringToDateTime = (date) => date === null ? '' : dayjs(date).format('YYYY-MM-DDTHH:mm');

const formatISOStringToDateTimeWithSlash = (date) => date === null ? '' : dayjs(date).format('DD/MM/YY HH:mm');

const getLastWord = (string) => {
  const wordArray = string.split(' ');
  return wordArray[wordArray.length - 1];
};

const isEscapeKey = (key) => key === 'Escape';

const sortWayPointDay = (point1, point2) => dayjs(point1.dateFrom).diff(dayjs(point2.dateFrom));

const sortWayPointPrice = (point1, point2) => (point2.basePrice - point1.basePrice);

const getDestinationById = (idDestination, allDestinations) => allDestinations.find((destinationItem) => destinationItem.id === idDestination);

const getOffersByType = (typeOffer, allOffers) => allOffers.find((offer) => offer.type === typeOffer).offers;

const getOffers = (wayPoint, allOffers) => getOffersByType(wayPoint.type, allOffers).filter((offer) => wayPoint.offers.includes(offer.id));

export {
  getRandomArrayElement,
  getRandomInteger,
  toUpperCaseFirstLetter,
  formatISOStringToMonthDay,
  formatISOStringToTime,
  formatISOStringToDate,
  formatISOStringToDateTime,
  formatISOStringToDateTimeWithSlash,
  getLastWord,
  isEscapeKey,
  filter,
  sortWayPointDay,
  sortWayPointPrice,
  getDestinationById,
  getOffersByType,
  getOffers
};
