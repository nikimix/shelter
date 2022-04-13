import {getPetsData} from './all-pets.js';

const body = document.body;
const popup = document.querySelector('#popup').content.querySelector('.popup');
const petCards = body.querySelectorAll('.card');
const petsData = getPetsData();


function getPetName(card) {
  return card.querySelector('.card__title').textContent;
}

function getPetData(petName) {
  return petsData.find(pet => pet.name === petName);
}

function createPopup(card) {
  const pet = getPetData(getPetName(card));
  popup.querySelector('.popup__title').textContent = pet.name;
  popup.querySelector('.popup__subtitle').textContent = `${pet.type} - ${pet.breed}`;
  popup.querySelector('.popup__description').textContent = pet.description;
  popup.querySelector('.feature-list__description--age').textContent = pet.age;
  popup.querySelector('.feature-list__description--inoculations').textContent = pet.inoculations.join(', ');
  popup.querySelector('.feature-list__description--diseases').textContent = pet.diseases.join(', ');
  popup.querySelector('.feature-list__description--parasites').textContent = pet.parasites.join(', ');
  popup.querySelector('.popup__img').src = pet.img;
  return popup;
}

function showPopup(card) {
  const overlay = document.querySelector('.overlay');
  body.prepend(createPopup(card));
  overlay.classList.add('overlay--on');

  const popup = body.firstElementChild;
  const buttonPopupClose =  popup.querySelector('.popup__button-close');

  buttonPopupClose.addEventListener('click', () => {
    popup.remove();
    overlay.classList.remove('overlay--on');
  }, {once: true});

  overlay.addEventListener('click', () => {
    popup.remove();
    overlay.classList.remove('overlay--on');
  }, {once: true})
}

function addHandlers() {
  for(let petCard of petCards) {
    petCard.addEventListener('click', () => { showPopup(petCard) })
  }
}
addHandlers();

