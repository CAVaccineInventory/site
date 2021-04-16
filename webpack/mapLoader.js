window.addEventListener("load", initMap);

window.map = {};

// Initialize and populate the map
async function initMap() {
  // If we have initial coordinates in the URL params, use those.
  // Otherwise stick to some defaults that show all of CA.
  const urlParams = new URLSearchParams(window.location.search);
  let lat = 37.25967;
  if (urlParams.get("lat")) {
    lat = parseFloat(urlParams.get("lat"));
  }
  let lng = -119.335893;
  if (urlParams.get("lng")) {
    lng = parseFloat(urlParams.get("lng"));
  }
  let zoom = 6;
  if (urlParams.get("zoom")) {
    zoom = parseInt(urlParams.get("zoom"));
  }

  const mapElement = document.getElementById("js-map");
  const map = new google.maps.Map(mapElement, {
    zoom: zoom,
    center: { lng: lng, lat: lat },
    fullscreenControl: false,
    mapTypeControl: false,
    streetViewControl: false,
  });

  window.map = map;
  document.dispatchEvent(new CustomEvent("mapInit"));
}
