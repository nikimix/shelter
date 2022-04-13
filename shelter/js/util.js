 function getRandomInteger(min, max) {
   min = Math.ceil(min < max ? min : max);
   max = Math.floor(max > min ? max : min);
   return Math.floor(Math.random() * (max - min)) + min;
 }

function debounce(cb, delay = 300) {
  let timer = null;
  return () => {
    clearTimeout(timer);
    timer = setTimeout(cb, delay);
  }
 }

export {getRandomInteger, debounce};
