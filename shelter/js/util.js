function getRandomInteger(min, max) {
  min = Math.ceil(min < max ? min : max);
  max = Math.floor(max > min ? max : min);
  return Math.floor(Math.random() * (max - min)) + min;
}

function debounce(cb, delay) {
 let timer = null;
 return () => {
   clearTimeout(timer);
   timer = setTimeout(cb, delay);
 }
}

function shuffle(array) {
 for (let i = 1; i < array.length; i++) {
   let j = Math.floor(Math.random() * (i + 1));
   [array[i], array[j]] = [array[j], array[i]];
 }
 return array;
}

function blockScroll() {
 const windowWidth = document.documentElement.clientWidth;
 document.documentElement.style.overflow = 'hidden';
 document.documentElement.style.paddingRight = `${document.documentElement.clientWidth-windowWidth}px`;
}

function unlockScroll() {
 document.documentElement.style.overflow = '';
 document.documentElement.style.padding = "0px";
}

export {getRandomInteger, debounce, shuffle, blockScroll, unlockScroll};
