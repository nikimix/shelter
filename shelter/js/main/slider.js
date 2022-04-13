import {
  getPetsData
} from "../all-pets.js";
import {
  getRandomInteger,
  debounce
} from "../util.js";

const PETS_DATA = getPetsData();
const DELAY = 150;
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
const sliderListLenght = sliderList.children.length;
const displayWidth = parseFloat(getComputedStyle(document.body).width, 10);

let sliderChildren = sliderList.children;
let sliderDirection = '';
let elementsAmountInSlide = 3;

if (displayWidth < 1280 && displayWidth >= 768) {
  elementsAmountInSlide = 2;
  for (let i = 0; i < sliderListLenght - elementsAmountInSlide; i++) {
    sliderList.lastElementChild.remove();
  }
}

if (displayWidth < 768) {
  elementsAmountInSlide = 1;
  for (let i = 0; i < sliderListLenght - elementsAmountInSlide; i++) {
    sliderList.lastElementChild.remove();
  }
}

const sliderStep = sliderItem.offsetWidth * elementsAmountInSlide;

function getUniqueCardsData(filters) {
  const filteredData = PETS_DATA.filter(item => !filters.includes(item.name));
  const uniqueCardsData = [];
  for (let i = 0; i < filters.length; i++) {
    const randomNumber = getRandomInteger(0, filteredData.length);
    uniqueCardsData.push(filteredData[randomNumber]);
    filteredData.splice(randomNumber, 1);
  }
  return uniqueCardsData;
}

function createUniqueCards() {
  const newFragment = document.createDocumentFragment();
  let uniqueCardsData = '';
  let filters = '';
  let cardClone = '';

  if (elementsAmountInSlide < 2) {
    filters = sliderList.firstElementChild.querySelector('.card__title').textContent;
    uniqueCardsData = PETS_DATA.filter(item => filters !== item.name)[getRandomInteger(0, PETS_DATA.length - 1)];
    cardClone = sliderItem.cloneNode(true);
    cardClone.querySelector('.card__title').textContent = uniqueCardsData.name;
    cardClone.querySelector('.card__img').src = uniqueCardsData.img;
    newFragment.append(cardClone);
  }

  if (elementsAmountInSlide >= 2) {
    filters = Array.from(sliderChildren).map(item => item.querySelector('.card__title').textContent);
    uniqueCardsData = getUniqueCardsData(filters);

    Array.from(sliderChildren).forEach((item, index) => {
      cardClone = item.cloneNode(true);
      cardClone.querySelector('.card__title').textContent = uniqueCardsData[index].name;
      cardClone.querySelector('.card__img').src = uniqueCardsData[index].img;
      newFragment.append(cardClone);
    });
  }

  return newFragment;
}

function deleteElements(placing) {
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
  sliderList.style.transform = getTranslate(direction * sliderStep);
}

sliderNextButton.addEventListener("click", debounce(() => {
  sliderDirection = DIRECTION_RIGHT;
  sliderList.append(createUniqueCards());
  sliderWrapper.style.justifyContent = "flex-start";
  sliderList.style.justifyContent = "flex-start";
  setTransform(sliderDirection);
}, DELAY));

sliderPrevButton.addEventListener("click", debounce(() => {
  sliderDirection = DIRECTION_LEFT;
  sliderList.prepend(createUniqueCards());
  sliderWrapper.style.justifyContent = "flex-end";
  sliderList.style.justifyContent = "flex-end";
  setTransform(sliderDirection);
}, DELAY));

sliderList.addEventListener('transitionstart', (evt) => {
  if (evt.target === sliderList) {
    sliderWrapper.classList.add('slider__wrapper--slider-in-move');

  }
})

sliderList.addEventListener("transitionend", (evt) => {
  if (evt.target === sliderList) {
    deleteElements(sliderDirection === DIRECTION_LEFT ? PLACING_BEFFORE : PLACING_AFTER);
    sliderWrapper.classList.remove('slider__wrapper--slider-in-move');
    sliderList.style.transition = "none";
    setTransform(0);
    setTimeout(() => {
      sliderList.style.transition = DEFAULT_TRANSITION;
    });
  }
});
