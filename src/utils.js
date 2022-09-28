import dayjs from 'dayjs';
import { UNIT_DATE } from './const.js';
import { FilterType } from './const.js';

const isFutureDate = (dateStart, dateEnd) => dayjs().isBefore(dayjs(dateStart), UNIT_DATE) || dayjs().isBefore(dayjs(dateEnd), UNIT_DATE);

const isDatesEqual = (date1, date2) => (date1 === null && date2 === null) || dayjs(date1).isSame(date2, UNIT_DATE);

const filter = {
  [FilterType.EVERYTHING]: (wayPoints) => wayPoints,
  [FilterType.FUTURE]: (wayPoints) => wayPoints.filter((wayPoint) => isFutureDate(wayPoint.dateFrom, wayPoint.dateTo)),
};

const getRandomInteger = (min = 1, max = 1000) => {
  const minNumber = Math.min(Math.abs(min), Math.abs(max));
  const maxNumber = Math.max(Math.abs(min), Math.abs(max));
  return Math.floor(minNumber + Math.random() * (maxNumber - minNumber + 1));
};

const getRandomArrayElement = (elements) => elements[getRandomInteger(0, elements.length - 1)];

const formatStringToMonthDay = (date) => date === null ? '' : dayjs(date).format('MMM D');

const formatStringToTime = (date) => date === null ? '' : dayjs(date).format('HH:mm');

const formatStringToDate = (date) => date === null ? '' : dayjs(date).format('YYYY-MM-DD');

const formatStringToDateTime = (date) => date === null ? '' : dayjs(date).format('YYYY-MM-DDTHH:mm');

const formatStringToDateTimeSlash = (date) => date === null ? '' : dayjs(date).format('DD/MM/YY HH:mm');

const isEscapeKey = (key) => key === 'Escape';

const sortWayPointDay = (point1, point2) => dayjs(point1.dateFrom).diff(dayjs(point2.dateFrom));

const sortWayPointPrice = (point1, point2) => (point2.basePrice - point1.basePrice);

const getDestinationById = (idDestination, destinations) => destinations.find((destination) => destination.id === idDestination);

const getIdByDestinationName = (destinationName, destinations) => destinations.find((destination) => destinationName === destination.name).id;

const getOffersByType = (typeOffer, offers) => offers.find((offer) => offer.type === typeOffer).offers;

const getOffers = (wayPoint, offers) => getOffersByType(wayPoint.type, offers).filter((offer) => wayPoint.offers.includes(offer.id));

export {
  getRandomArrayElement,
  getRandomInteger,
  formatStringToMonthDay,
  formatStringToTime,
  formatStringToDate,
  formatStringToDateTime,
  formatStringToDateTimeSlash,
  isEscapeKey,
  filter,
  sortWayPointDay,
  sortWayPointPrice,
  getDestinationById,
  getIdByDestinationName,
  getOffersByType,
  getOffers,
  isDatesEqual
};
