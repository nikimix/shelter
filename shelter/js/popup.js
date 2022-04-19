import {
  getPetsData
} from './all-pets.js';
import { blockScroll,unlockScroll } from './util.js';

const PETS_DATA = getPetsData();

const body = document.body;
const popup = document.querySelector('#popup').content.querySelector('.popup');
const petsList = document.querySelector('.pets-list');


function createPopup(card) {
  const petName = card.querySelector('.card__title').textContent;
  const features = PETS_DATA.find(pet => pet.name === petName);
  popup.querySelector('.popup__title').textContent = features.name;
  popup.querySelector('.popup__subtitle').textContent = `${features.type} - ${features.breed}`;
  popup.querySelector('.popup__description').textContent = features.description;
  popup.querySelector('.feature-list__description--age').textContent = features.age;
  popup.querySelector('.feature-list__description--inoculations').textContent = features.inoculations.join(', ');
  popup.querySelector('.feature-list__description--diseases').textContent = features.diseases.join(', ');
  popup.querySelector('.feature-list__description--parasites').textContent = features.parasites.join(', ');
  popup.querySelector('.popup__img').src = features.img;
  return popup;
}

function showPopup(card) {
  const overlay = document.querySelector('.overlay');
  body.prepend(createPopup(card));
  overlay.classList.add('overlay--on');

  const popup = body.firstElementChild;
  const buttonPopupClose = popup.querySelector('.popup__button-close');

  buttonPopupClose.addEventListener('click', () => {
    popup.remove();
    overlay.classList.remove('overlay--on');
    unlockScroll();
  }, {
    once: true
  });

  overlay.addEventListener('click', () => {
    popup.remove();
    overlay.classList.remove('overlay--on');
    unlockScroll();
  }, {
    once: true
  })
}

function onClickCard(evt) {
  const card = evt.target.closest('.card');
  if (!card) {
    return;
  }
  showPopup(card);
  blockScroll();
}

petsList.addEventListener('click', evt => onClickCard(evt));
