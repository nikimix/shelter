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

export {getRandomInteger, debounce, shuffle};
