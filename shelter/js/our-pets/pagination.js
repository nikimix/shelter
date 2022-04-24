import {
  getPetsData
} from "../all-pets.js";
import {
  shuffle
} from "../util.js";

const NEXT = 'right';
const BACK = 'left';

const STATE_HIDE = 'hide';
const STATE_VISIBLE = 'visible';

const STATE_BLOCKED = 'blocked';
const STATE_UNCLOCKED = 'unlocked';

const DISPLAY_MAX_WIDTH = 1280;
const DISPLAY_TABLET_WIDTH = 768;

const NUMBER_CARDS_ON_DESKTOP = 8;
const NUMBER_CARDS_ON_TABLET = 6;
const NUMBER_CARDS_ON_MOBILE = 3;
const AMOUNT_TRANSITIONS = 2;

const petsData = getPetsData();
const petsList = document.querySelector('.pets-list');
const pagination = document.querySelector('.pagination');
const paginationButtonToFirst = pagination.querySelector('.pagination__button--to-first');
const paginationButtonBack = pagination.querySelector('.pagination__button--back');
const paginationButtonCurrent = pagination.querySelector('.pagination__button--current');
const paginationButtonNext = pagination.querySelector('.pagination__button--next');
const paginationButtonToLast = pagination.querySelector('.pagination__button--to-last');
const cards = petsList.querySelectorAll('.card');
let pageNumber = paginationButtonCurrent.textContent - 1;
let counterAmountTransitions = 0;
let isBlockedButton = false;

function getNumberOfCardsOnPage() {
  const displayWidth = parseFloat(getComputedStyle(document.body).width, 10);
  if (displayWidth > DISPLAY_MAX_WIDTH) {
    return NUMBER_CARDS_ON_DESKTOP;
  }
  return displayWidth >= DISPLAY_TABLET_WIDTH ? NUMBER_CARDS_ON_TABLET : NUMBER_CARDS_ON_MOBILE;
}

let elementsAmountOnPage = getNumberOfCardsOnPage();

function getRandomSetPets() {
  let previousSet = petsData.slice();
  const randomSet = []
  for (let i = 0; i < 5; i++) {
    previousSet = shuffle(previousSet);
    randomSet.push(...previousSet);
  }
  return randomSet;
}

const setPets = petsData.slice().concat(getRandomSetPets());

const maxNumberPages = setPets.length / elementsAmountOnPage;

function unlockButton(button) {
  button.classList.remove('pagination__button--inactive');
  button.classList.add('pagination__button--active');
  button.removeAttribute('disabled', '');
}

function blockButton(button) {
  button.classList.remove('pagination__button--active');
  button.classList.add('pagination__button--inactive');
  button.setAttribute('disabled', '');
}

function createNewCards() {
  const start = +pageNumber * elementsAmountOnPage;
  const end = (+pageNumber + 1) * elementsAmountOnPage;
  const elementsNextPage = setPets.slice(start, end);
  for (let i = 0; i < elementsAmountOnPage; i++) {
    cards[i].querySelector('.card__title').textContent = elementsNextPage[i].name;
    cards[i].querySelector('.card__img').src = elementsNextPage[i].img;
  }
}

function changePaginationState(state) {
  if (state === 'blocked') {
    for (const button of pagination.children) {
      button.setAttribute('disabled', '')
    }
  }
  if (state === 'unlocked') {
    for (const button of pagination.children) {
      button.removeAttribute('disabled', '');
    }
  }
}

function onTransitionStartItem(evt) {
  if (evt.target.closest('.pets__item')) {
    changePaginationState(STATE_BLOCKED)
  }

  petsList.removeEventListener('transitionstart', onTransitionStartItem);
}

function changeElementsView(state) {
  if (state === 'hide') {
    for (let i = 0; i < elementsAmountOnPage; i++) {
      petsList.children[i].style.opacity = '0';
      petsList.children[i].style.pointerEvents = 'none';
    }
  }
  if (state === 'visible') {
    for (let i = 0; i < elementsAmountOnPage; i++) {
      petsList.children[i].style.opacity = '1';
      petsList.children[i].style.pointerEvents = 'auto';
    }
  }
}

function onTransitionEndItem(evt) {
  counterAmountTransitions++;
  if (evt.target.closest('.pets__item')) {
    createNewCards();
    changeElementsView(STATE_VISIBLE)

    if (counterAmountTransitions === elementsAmountOnPage * AMOUNT_TRANSITIONS) {
      changePaginationState(STATE_UNCLOCKED);
      petsList.removeEventListener('transitionend', onTransitionStartItem);
    }
  }
}

function checkButtonBlocked() {
  if (isBlockedButton) {
    if (pageNumber === 0) {
      blockButton(paginationButtonBack);
      blockButton(paginationButtonToFirst);
    } else {
      unlockButton(paginationButtonBack);
      unlockButton(paginationButtonToFirst);
    }

    if (pageNumber + 1 === maxNumberPages) {
      blockButton(paginationButtonNext);
      blockButton(paginationButtonToLast);
    } else {
      unlockButton(paginationButtonNext);
      unlockButton(paginationButtonToLast);
    }
  }
}

function changePageNumber(direction) {
  if (direction === 'right') {
    pageNumber++;
    paginationButtonCurrent.textContent = pageNumber + 1;
    isBlockedButton = pageNumber === 1 || pageNumber === maxNumberPages - 1 ? true : false;
  } else if (direction === 'left') {
    pageNumber--;
    paginationButtonCurrent.textContent = pageNumber + 1;
    isBlockedButton = pageNumber === maxNumberPages - 2 || pageNumber === 0 ? true : false;
  } else {
    paginationButtonCurrent.textContent = pageNumber + 1;
    isBlockedButton = pageNumber === 0 || pageNumber === maxNumberPages - 1 ? true : false;
  }
}

function addTransitionHandlers() {
  petsList.addEventListener('transitionstart', onTransitionStartItem);
  petsList.addEventListener('transitionend', onTransitionEndItem);
}

function goToPage(page) {
  addTransitionHandlers();
  changeElementsView(STATE_HIDE);
  changePageNumber(page);
  checkButtonBlocked();
}

function onClickPaginationButton(evt) {
  const buttonActive = evt.target.closest('.pagination__button--active');
  const buttonNext = evt.target.closest('.pagination__button--next');
  const buttonToLast = evt.target.closest('.pagination__button--to-last');
  const buttonBack = evt.target.closest('.pagination__button--back');
  const buttonToFirst = evt.target.closest('.pagination__button--to-first');
  counterAmountTransitions = 0;
  let direction = null;

  if (!buttonActive) {
    return;
  }

  if (buttonToLast) {
    pageNumber = maxNumberPages - 1;
  }
  if (buttonToFirst) {
    pageNumber = 0;
  }
  if (buttonNext) {
    direction = NEXT;
  }
  if (buttonBack) {
    direction = BACK;
  }
  goToPage(direction);
}

pagination.addEventListener('click', (evt) => onClickPaginationButton(evt));
