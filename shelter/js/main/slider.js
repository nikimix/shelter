import {
  getPetsData
} from "../all-pets.js";
import {
  getRandomInteger,
  debounce
} from "../util.js";

const petsData = getPetsData();
const DELAY = 50;
const DIRECTION_RIGHT = -1;
const DIRECTION_LEFT = 1;
const PLACING_BEFFORE = "before";
const PLACING_AFTER = "after";
const DEFAULT_TRANSITION = "transform 0.6s ease";

const sliderPrevButton = document.querySelector(".slider__button--back");
const sliderNextButton = document.querySelector(".slider__button--next");
const sliderWrapper = document.querySelector('.slider__wrapper');
const sliderList = sliderWrapper.firstElementChild;
const sliderItem = sliderList.firstElementChild;
const sliderItemWidth = sliderItem.offsetWidth;
const cloneSliderList = sliderList.cloneNode(true);

let sliderChildren = sliderList.children;
let sliderDirection = null;

function getAmountElementsInSlide() {
  const displayWidth = parseFloat(getComputedStyle(document.body).width, 10);
  if (displayWidth > 1280) {
    return 3;
  }
  return displayWidth >= 768 ? 2 : 1;
}

function updateSliderList(quantity) {
  sliderList.innerHTML = '';
  for (let i = 0; i < quantity; i++) {
    sliderList.appendChild(cloneSliderList.children[i].cloneNode(true));
  }
}

function getSliderStep() {
  const elementsAmountInSlide = getAmountElementsInSlide();
  return sliderItemWidth * elementsAmountInSlide + parseInt(getComputedStyle(sliderList).columnGap, 10) * elementsAmountInSlide;
}

window.addEventListener('resize', debounce(() => {
  updateSliderList(getAmountElementsInSlide());
}, DELAY));

window.addEventListener('load', () => updateSliderList(getAmountElementsInSlide()));

function getUniqueCardsData(filters) {
  const filteredData = petsData.filter(item => !filters.includes(item.name));
  const uniqueCardsData = [];

  for (let i = 0; i < filters.length; i++) {
    const randomNumber = getRandomInteger(0, filteredData.length);
    uniqueCardsData.push(filteredData[randomNumber]);
    filteredData.splice(randomNumber, 1);
  }

  return uniqueCardsData;
}

function createNewItem(petData) {
  const cardClone = sliderItem.cloneNode(true);
  cardClone.querySelector('.card__title').textContent = petData.name;
  cardClone.querySelector('.card__img').src = petData.img;
  return cardClone;
}

function createUniqueCards() {
  const newFragment = document.createDocumentFragment();
  let uniqueCardsData = null;
  let filters = null;

  if (getAmountElementsInSlide() < 2) {
    filters = sliderList.firstElementChild.querySelector('.card__title').textContent;
    uniqueCardsData = petsData.filter(item => filters !== item.name)[getRandomInteger(0, petsData.length - 1)];
    newFragment.append(createNewItem(uniqueCardsData));
  }

  if (getAmountElementsInSlide() >= 2) {
    filters = Array.from(sliderChildren).map(item => item.querySelector('.card__title').textContent);
    uniqueCardsData = getUniqueCardsData(filters);
    for (let item of uniqueCardsData) {
      newFragment.append(createNewItem(item));
    }
  }

  return newFragment;
}

function deletePreviousSlide(placing) {
  if (placing === "before") {
    for (let i = 0; i < sliderChildren.length; i++) {
      sliderList.lastElementChild.remove();
    }
  }

  if (placing === "after") {
    for (let i = 0; i < sliderChildren.length; i++) {
      sliderList.firstElementChild.remove();
    }
  }
}

function getTranslate(shiftX) {
  return `translateX(${shiftX}px)`;
}

function setTransform(direction) {
  sliderDirection = direction;
  sliderList.style.transform = getTranslate(sliderDirection * getSliderStep());
}

sliderNextButton.addEventListener("click", debounce(() => {
  sliderList.append(createUniqueCards());
  setTransform(DIRECTION_RIGHT);
}, DELAY));

sliderPrevButton.addEventListener("click", debounce(() => {
  sliderList.prepend(createUniqueCards());
  setTransform(DIRECTION_RIGHT);
}, DELAY));

sliderList.addEventListener('transitionstart', (evt) => {
  if (evt.target === sliderList) {
    sliderPrevButton.setAttribute('disabled', '');
    sliderNextButton.setAttribute('disabled', '');
  }
})

sliderList.addEventListener("transitionend", (evt) => {
  if (evt.target === sliderList) {
    deletePreviousSlide(sliderDirection === DIRECTION_LEFT ? PLACING_BEFFORE : PLACING_AFTER);
    sliderPrevButton.removeAttribute('disabled');
    sliderNextButton.removeAttribute('disabled');
    sliderList.style.transition = "none";

    setTransform(0);

    setTimeout(() => {
      sliderList.style.transition = DEFAULT_TRANSITION;
    });
  }
});
