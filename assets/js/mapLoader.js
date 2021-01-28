import { getHasVaccine, fetchSites } from "/assets/js/data.js";
import { addLocation } from "/assets/js/map.js";

window.addEventListener("load", initMap);

window.map = {};

// Initialize and populate the map
async function initMap() {
  const mapElement = document.getElementById("js_map");
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

  if ("locate" in mapElement.dataset) {
    setupLocateMe();
  }
}

function setupLocateMe() {
  const map = window.map;

  if (!navigator.geolocation) {
    console.warn("navigator not supported");
  }
  const template = document.getElementById("locate_me_template");
  const locationButton = template.content
    .cloneNode(true)
    .getElementById("locate_me");
  locationButton.textContent = "Locate around me!";
  map.controls[google.maps.ControlPosition.TOP_CENTER].push(locationButton);
  locationButton.addEventListener("click", () => {
    if (navigator.geolocation) {
      locationButton.textContent = "Locating...";
      navigator.geolocation.getCurrentPosition(
        (position) => {
          locationButton.textContent = "Locate around me!";
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          map.setCenter(pos);
          map.setZoom(10);
        },
        (e) => {
          console.warn(e);
          locationButton.textContent = "Failed, please try again";
        },
        {
          maximumAge: 1000 * 60 * 5, // 5 minutes
          timeout: 1000 * 20, // 20 seconds
          enableHighAccuracy: false,
        }
      );
    } else {
      console.error("Geolocation not supported");
    }
  });
}
