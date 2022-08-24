import dayjs from 'dayjs';

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
  isEscapeKey
};
