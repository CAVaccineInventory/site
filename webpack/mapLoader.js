import { getHasVaccine, fetchSites } from "./data/locations.js";
import { addLocation } from "./map.js";

window.addEventListener("load", initMap);

window.map = {};

// Initialize and populate the map
async function initMap() {
  const mapElement = document.getElementById("js-map");
  const map = new google.maps.Map(mapElement, {
    zoom: 6,
    center: { lng: -119.335893, lat: 37.25967 },
    mapTypeControl: false,
    streetViewControl: false,
  });
  window.map = map;

  const sites = await fetchSites();
  sites.forEach((p) => {
    if (!getHasVaccine(p)) {
      return;
    }

    addLocation(p);
  });

  document.dispatchEvent(new CustomEvent("mapInit"));
}
