import { t } from "./i18n";

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
    mapTypeControl: false,
    streetViewControl: false,
  });

  // If we support HTMLa5 geolocation, add a button
  if (navigator.geolocation) {
    const locationButton = document.createElement("button");
    locationButton.textContent = t("map.jump_to_current_location");
    locationButton.classList.add("custom-map-control-button");
    map.controls[google.maps.ControlPosition.TOP_CENTER].push(locationButton);
    locationButton.addEventListener("click", () => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          map.setCenter(pos);
        },
        (error) => {
          Sentry.captureException(error);
          alert(window.messageCatalog["nearest_js_alert_detect"]);
          onFinish();
          resolve();
        }
      );
    });
  }

  window.map = map;
  document.dispatchEvent(new CustomEvent("mapInit"));
}
