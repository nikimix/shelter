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
const cloneSliderList = sliderList.cloneNode(true);

const  sliderChildren = sliderList.children;
let sliderDirection = null;

function getAmountSlideElements() {
  const windowWidth = document.body.offsetWidth;

  if (windowWidth > 1280) {
    return 3;
  }

  return windowWidth >= 768 ? 2 : 1;
}
let amountSlideElements = getAmountSlideElements();

function updateSliderList() {
  amountSlideElements = getAmountSlideElements();
  sliderList.innerHTML = '';
  for (let i = 0; i < amountSlideElements; i++) {
    sliderList.append(cloneSliderList.children[i].cloneNode(true));
  }
}

function getSliderStep() {
  return sliderList.offsetWidth + parseInt(getComputedStyle(sliderList).columnGap, 10)
}

window.addEventListener('resize', debounce(() => {
  updateSliderList();
}, DELAY));

function getNewSlideElements(filters) {
  const filteredCards = petsData.filter(item => !filters.includes(item.name));
  const uniqueCards = [];

  for (let i = 0; i < filters.length; i++) {
    const randomNumber = getRandomInteger(0, filteredCards.length);
    uniqueCards.push(filteredCards[randomNumber]);
    filteredCards.splice(randomNumber, 1);
  }

  return uniqueCards;
}

function createNewCard(petData) {
  const newCard = sliderItem.cloneNode(true);
  newCard.querySelector('.card__title').textContent = petData.name;
  newCard.querySelector('.card__img').src = petData.img;
  return newCard;
}

function createNewSlide() {
  const newFragment = document.createDocumentFragment();
  const filters = [];
  for (let i = 0; i < amountSlideElements; i++) {
    filters.push(sliderChildren[i].querySelector('.card__title').textContent);
  }
  getNewSlideElements(filters).forEach(card => newFragment.append(createNewCard(card)));
  return newFragment;
}

function deletePreviousSlide(placing) {
  if (placing === "before") {
    for (let i = 0; i < amountSlideElements; i++) {
      sliderList.lastElementChild.remove();
    }
  } else {
    for (let i = 0; i < amountSlideElements; i++) {
      sliderList.firstElementChild.remove();
    }
  }
}

function getTranslate(shiftX) {
  return `translateX(${shiftX}px)`;
}

function setTransform(direction) {
  const sliderStep = getSliderStep()
  sliderDirection = direction;
  sliderList.style.transform = getTranslate(direction * sliderStep);
}

function swipeSlide(evt) {
  const buttonNext = evt.target.closest('.slider__button--next');
  const buttonBack = evt.target.closest('.slider__button--back');
  if (!buttonNext && !buttonBack) {
    return;
  }
  const newSlide = createNewSlide();
  if (buttonNext) {
    sliderList.style.justifyContent = 'flex-start';
    sliderList.append(newSlide);
    setTransform(DIRECTION_RIGHT);
  } else {
    sliderList.style.justifyContent = 'flex-end';
    sliderList.prepend(newSlide);
    setTransform(DIRECTION_LEFT);
  }
}

sliderNextButton.addEventListener("click", swipeSlide);

sliderPrevButton.addEventListener("click", swipeSlide);

sliderList.addEventListener('transitionstart', (evt) => {
  if (evt.target === sliderList) {
    sliderNextButton.removeEventListener("click", swipeSlide);
    sliderPrevButton.removeEventListener("click", swipeSlide);
  }
})

sliderList.addEventListener("transitionend", (evt) => {
  if (evt.target === sliderList) {
    deletePreviousSlide(sliderDirection === DIRECTION_LEFT ? PLACING_BEFFORE : PLACING_AFTER);
    sliderNextButton.addEventListener("click", swipeSlide);
    sliderPrevButton.addEventListener("click", swipeSlide);
    sliderList.style.transition = "none";
    setTransform(0);
    setTimeout(() => {
      sliderList.style.transition = DEFAULT_TRANSITION;
    });
  }
});

window.addEventListener('load', () => updateSliderList(getAmountSlideElements()));
