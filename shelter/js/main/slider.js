  import { getAllPets } from "../all-pets.js";

  const allPets = getAllPets();
  const slider = document.querySelector('.pets-slider');
  const buttonSlideBack = slider.querySelector('.pets-slider__button--back');
  const buttonSlideNext = slider.querySelector('.pets-slider__button--next');

  function getRandomInteger(min, max) {
    min = Math.ceil(min < max ? min : max);
    max = Math.floor(max > min ? max : min);
    return Math.floor(Math.random() * (max - min)) + min;
  }

  function getUniquePets(currentCardsNames) {
    const uniquePetsList = allPets.filter(pet => !currentCardsNames.includes(pet.name));
    const uniquePets = [];

    for(let i = 0; i < currentCardsNames.length; i++) {
      const randomNumber = getRandomInteger(0, uniquePetsList.length);
      uniquePets.push(uniquePetsList[randomNumber]);
      uniquePetsList.splice(randomNumber, 1);
    }

    return uniquePets;
  }

  function setNewAddressForImg(currentAddress, newAddress) {
    const pathToDirectory = currentAddress.indexOf('img/');
    return `${currentAddress.split('').slice(0, pathToDirectory).join('')}${newAddress}`;
  }

  function changeSlide() {
    const sliderCards = slider.querySelectorAll('.pet-card');
    const currentCardsNames = Array.from(slider.querySelectorAll('.pet-card__title')).map(item => item.textContent);
    const uniquePets = getUniquePets(currentCardsNames);

    for (let i = 0; i < sliderCards.length; i++) {
      const cardImage = sliderCards[i].querySelector('.pet-card__img');
      const cardTitle = sliderCards[i].querySelector('.pet-card__title');
      cardImage.src = setNewAddressForImg(cardImage.src, uniquePets[i].img);
      cardTitle.textContent = uniquePets[i].name;
    }
  }

  buttonSlideBack.addEventListener('click', changeSlide);
  buttonSlideNext.addEventListener('click', changeSlide);
