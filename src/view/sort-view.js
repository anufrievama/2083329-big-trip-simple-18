import AbstractView from '../framework/view/abstract-view';
import { SortTypes } from '../mock/const.js';

const createSortItemTemplate = () => SortTypes.map((sortType, index) => {
  const isChecked = index === 0 ? 'checked' : '';
  const isDisabled = sortType === 'price' || sortType === 'day' ? '' : 'disabled';
  return `<div class="trip-sort__item  trip-sort__item--${sortType}">
    <input id="sort-${sortType}" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-${sortType}" ${isChecked} ${isDisabled}>
    <label class="trip-sort__btn" for="sort-${sortType}">${sortType}</label>
  </div>`;
}).join('');

const createSortTemplate = () =>
  `<form class="trip-events__trip-sort  trip-sort" action="#" method="get">
  ${createSortItemTemplate()}
</form>`;

export default class SortView extends AbstractView {
  get template() {
    return createSortTemplate();
  }
}

