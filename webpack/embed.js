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

  const center = window.map.getCenter();
  for (const site of sitesToShow) {
    const siteCoord = getCoord(site);
    const distance = distanceBetweenCoordinates(center, siteCoord);
    site.distance = distance;
  }
  sitesToShow.sort((a, b) => a.distance - b.distance);

  addSitesOrHideIfEmpty(sitesToShow.slice(0, 50), "js-sites-with-vaccine");
}

// https://github.com/skalnik/aqi-wtf/blob/main/app.js#L238-L250
function distanceBetweenCoordinates(coord1, coord2) {
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
