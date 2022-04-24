import { blockScroll, unlockScroll } from "./util.js";

const logo = document.querySelector('.logo');
const menuToggle = document.querySelector('.header__toggle');
const nav = document.querySelector('.nav');
const sidebar = document.querySelector('.sidebar');
const overlay = document.querySelector('.overlay');
const currentLinkMainPage = sidebar.querySelector('.nav__link--current');
const navLinkHelp = sidebar.querySelector('.nav__link--help');
const navLinkContacts = sidebar.querySelector('.nav__link--contacts');

function changeElementsClass(action) {
  if (action === 'add') {
    menuToggle.classList.add('header__toggle--opened');
    logo.classList.add('logo--hidden');
    sidebar.classList.add('sidebar--open');
    overlay.classList.add('overlay--on');
  } else {
    menuToggle.classList.remove('header__toggle--opened');
    logo.classList.remove('logo--hidden');
    sidebar.classList.remove('sidebar--open');
    overlay.classList.remove('overlay--on');
  }
}

function onClickElement(elem, className) {
  if (elem.classList.contains(className)) {
    changeElementsClass('remove');
    unlockScroll();
  } else {
    changeElementsClass('add');
    blockScroll();
  }
}

menuToggle.addEventListener('click', () => {
  onClickElement(menuToggle, 'header__toggle--opened')
});
overlay.addEventListener('click', () => {
  onClickElement(overlay, 'overlay--on')
});

currentLinkMainPage.addEventListener('click', () => {
  changeElementsClass('remove');
  unlockScroll();
});

navLinkHelp.addEventListener('click', () => {
  changeElementsClass('remove');
  unlockScroll();
});
navLinkContacts.addEventListener('click', () => {
  changeElementsClass('remove');
  unlockScroll();
});
