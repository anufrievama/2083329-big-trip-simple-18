import { OFFER_TITLES, WAY_POINT_TYPES, Price } from './const.js';
import { getRandomInteger } from '../utils.js';

const generateOffer = (id, type) => ({
  id,
  type,
  title: `${type}: ${OFFER_TITLES[id - 1]}`,
  price: getRandomInteger(Price.MIN, Price.MAX),
});

const generateOffers = () => {
  let offers = [];
  for (const type of WAY_POINT_TYPES) {
    const offersByType = Array.from({ length: OFFER_TITLES.length }, (_value, index) => generateOffer(index + 1, type));
    offers = offers.concat(offersByType);
  }
  return offers;
};

const generateRandomOfferIds = () => {
  const offerIds = [];
  const randomCountOffers = getRandomInteger(0, OFFER_TITLES.length);
  if (randomCountOffers > 0) {
    for (let i = 0; i < randomCountOffers; i++) {
      const randomId = getRandomInteger(1, OFFER_TITLES.length);
      offerIds.push(randomId);
    }
  }
  return offerIds;
};

export { generateOffers, generateRandomOfferIds };

