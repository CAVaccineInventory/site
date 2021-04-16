import {
  fetchSites,
  getHasVaccine,
  sortByRecency,
  getCoord,
} from "./data/locations.js";
import { t } from "./i18n";
import zipCodes from "./json/zipCodes.json";
import { addLocation, tryOrDelayToMapInit } from "./map.js";
import { addSitesOrHideIfEmpty } from "./sites.js";
import zipSearchBoxTemplate from "./templates/zipSearchBox.handlebars";
import { debounce, extractZip } from "./util.js";

window.addEventListener("load", loaded);
async function loaded() {
  const sites = await fetchSites();
  window.filteredSites = sites.filter(getHasVaccine);
  sortByRecency(filteredSites);

  tryOrDelayToMapInit(() => {
    addButtonsToMap();
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

function moveToZip(zip) {
  const data = zipCodes[zip];
  // TODO: Handle invalid ZIP
  const coordinate = data.coordinates;
  moveMap(coordinate);
}

function moveMap(coordinates) {
  tryOrDelayToMapInit((map) => {
    const mapCoord = {
      lat: coordinates.latitude,
      lng: coordinates.longitude,
    };
    map.setCenter(mapCoord);
    map.setZoom(12);
  });
}

window.submitZip = function () {
  const maybeZip = extractZip(document.getElementById("zip-input"));
  // TODO: Handle invalid ZIP
  moveToZip(maybeZip);
};

window.onZipInputKeyDown = function (event) {
  if (event.key === "Enter") {
    submitZip();
  }
};

function addButtonsToMap() {
  const zipSearchBox = document.createElement("div");
  zipSearchBox.classList.add("custom-map-container");
  zipSearchBox.innerHTML = zipSearchBoxTemplate();
  window.map.controls[google.maps.ControlPosition.TOP_CENTER].push(
    zipSearchBox
  );

  // If we support HTMLa5 geolocation, add a button
  if (navigator.geolocation) {
    const locationButton = document.createElement("button");
    locationButton.textContent = t("embed.locations_near_me");
    locationButton.classList.add("custom-map-control-button");
    window.map.controls[google.maps.ControlPosition.TOP_CENTER].push(
      locationButton
    );
    locationButton.addEventListener("click", () => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          moveMap(position.coords);
        },
        () => {
          alert(t("map.failed_to_detect_location"));
        }
      );
    });
  }
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

  sortByRecency(sitesToShow);
  addSitesOrHideIfEmpty(sitesToShow.slice(0, 50), "js-sites-with-vaccine");
}
