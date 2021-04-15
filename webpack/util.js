// https://github.com/skalnik/aqi-wtf/blob/03e5090f8af3d6bf7aea47cd27e9d089103a877f/app.js#L238-L250
export function distanceBetweenCoordinates(coord1, coord2) {
  const p = Math.PI / 180;
  const a =
    0.5 -
    Math.cos((coord2.latitude - coord1.latitude) * p) / 2 +
    (Math.cos(coord1.latitude * p) *
      Math.cos(coord2.latitude * p) *
      (1 - Math.cos((coord2.longitude - coord1.longitude) * p))) /
      2;
  // 12742 is the diameter of earth in km
  return 12742 * Math.asin(Math.sqrt(a));
}

// https://www.freecodecamp.org/news/javascript-debounce-example/
export function debounce(func, timeout = 300) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      // eslint-disable-next-line no-invalid-this
      func.apply(this, args);
    }, timeout);
  };
}
