import { fetchSites, getHasVaccine, getCoord } from "./data/locations.js";
import { t } from "./i18n";
import { addLocation, tryOrDelayToMapInit } from "./map.js";
import { addSitesOrHideIfEmpty } from "./sites.js";
import embeddedMapControlsTemplate from "./templates/embeddedMapControls.handlebars";
import { debounce, distanceBetweenCoordinates } from "./util.js";

window.addEventListener("load", loaded);
async function loaded() {
  const sites = await fetchSites();
  window.filteredSites = sites.filter(getHasVaccine);

  tryOrDelayToMapInit(() => {
    configureMap();
    filteredSites.forEach(addLocation);
    window.map.addListener(
      "bounds_changed",
      debounce(() => {
        updateSitesFromMap();
        updateUrlParametersFromMap();
      })
    );
  });

  updateSitesFromMap();
}

function moveMap(coordinates) {
  tryOrDelayToMapInit((map) => {
    const mapCoord = {
      lat: coordinates.latitude,
      lng: coordinates.longitude,
    };
    map.setCenter(mapCoord);
    map.setZoom(13);
  });
}

function configureMap() {
  const searchContainer = document.createElement("div");
  searchContainer.classList.add("custom-map-container");
  searchContainer.innerHTML = embeddedMapControlsTemplate();

  const searchInput = searchContainer.querySelector("#search-input");
  window.map.controls[google.maps.ControlPosition.TOP_CENTER].push(
    searchContainer
  );

  const autocomplete = new google.maps.places.Autocomplete(searchInput, {
    componentRestrictions: { country: "us" },
    fields: ["geometry"],
    origin: window.map.getCenter(),
    strictBounds: false,
  });
  autocomplete.bindTo("bounds", window.map);
  autocomplete.addListener("place_changed", () => {
    const place = autocomplete.getPlace();

    if (!place.geometry || !place.geometry.location) {
      // User entered the name of a place that was not suggested and
      // pressed the Enter key, or the Place Details request failed.
      alert(t("embed.unable_to_find_location") + ": " + place.name);
      return;
    }
    window.map.setCenter(place.geometry.location);
    window.map.setZoom(13);
  });

  const autolocateButton = searchContainer.querySelector("#autolocate-button");
  autolocateButton.addEventListener("click", () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        moveMap(position.coords);
      },
      () => {
        alert(t("embed.failed_to_detect_location"));
      }
    );
  });
}

function updateUrlParametersFromMap() {
  const center = window.map.getCenter();
  const url = new URL(window.location.href);
  url.searchParams.set("lat", center.lat());
  url.searchParams.set("lng", center.lng());
  url.searchParams.set("zoom", window.map.zoom);
  window.history.replaceState(null, null, url.toString());
}

function updateSitesFromMap() {
  // If we get called before we've properly filtered sites on the map, skip this call
  // for now (and we'll populate this later)
  if (!window.filteredSites) {
    return;
  }

  document
    .querySelectorAll(".js-sites")
    .forEach((site) => (site.innerHTML = ""));

  const bounds = window.map.getBounds();
  const sitesToShow = window.filteredSites.filter((site) => {
    const { latitude, longitude } = getCoord(site);
    if (!latitude || !longitude) {
      return false;
    }

    return bounds.contains({ lat: latitude, lng: longitude });
  });

  const center = {
    latitude: window.map.getCenter().lat(),
    longitude: window.map.getCenter().lng(),
  };
  sitesToShow.sort(
    (a, b) =>
      distanceBetweenCoordinates(center, getCoord(a)) -
      distanceBetweenCoordinates(center, getCoord(b))
  );

  addSitesOrHideIfEmpty(sitesToShow.slice(0, 50), "js-sites-with-vaccine");
}
