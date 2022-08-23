import { DESTINATION_NAMES, DESTINATION_DESCRIPTIONS, CountPictures, URL_IMAGE } from './const.js';
import { getRandomInteger, getRandomArrayElement } from '../utils.js';

const generatePictures = () => Array.from({ length: getRandomInteger(CountPictures.MIN, CountPictures.MAX) }, () => ({
  src: `${URL_IMAGE}${getRandomInteger()}`,
  description: getRandomArrayElement(DESTINATION_DESCRIPTIONS),
}));

const generateDestination = (id) => (
  {
    id,
    description: getRandomArrayElement(DESTINATION_DESCRIPTIONS),
    name: DESTINATION_NAMES[id],
    pictures: generatePictures(),
  }
);

const generateDestinations = () => Array.from({ length: DESTINATION_NAMES.length }, (_value, index) => generateDestination(index + 1));

export { generateDestinations };
