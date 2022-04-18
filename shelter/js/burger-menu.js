const logo = document.querySelector('.logo');
const menuToggle = document.querySelector('.header__toggle');
const menuToggleOurPets = document.querySelector('.header__toggle--our-pets');
const nav = document.querySelector('.nav');
const sidebar = document.querySelector('.sidebar');
const overlay = document.querySelector('.overlay');
const currentLinkMainPage = sidebar.querySelector('.nav__link--current');
const navLinkHelp = sidebar.querySelector('.nav__link--help');
const navLinkContacts = sidebar.querySelector('.nav__link--contacts');

function closeMenu() {
  menuToggle.classList.toggle('header__toggle--opened');
  logo.classList.toggle('logo--hidden');
  sidebar.classList.toggle('sidebar--open');
  overlay.classList.toggle('overlay--on');
}

menuToggle.addEventListener('click', closeMenu);
overlay.addEventListener('click', closeMenu);
currentLinkMainPage.addEventListener('click',   closeMenu);

navLinkHelp.addEventListener('click', evt => evt.preventDefault());
navLinkContacts.addEventListener('click', evt => evt.preventDefault());


// function onClickAnchor(evt) {
//   const element = evt.target.closest('.js-anchor');
//   if (!element) {
//     return;
//   }
//   evt.preventDefault();
//   const blockId = element.getAttribute('href');
//   if (blockId && blockId !== '#') {
//     const block = document.querySelector(blockId);

//     if (block) {
//       block.scrollIntoView({
//         behavior: 'smooth',
//         block: 'start',
//       });
//     }
//   }
// }

// document.body.addEventListener('click', evt => onClickAnchor(evt));

