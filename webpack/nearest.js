import sendAnalyticsEvent from "./sendAnalyticsEvent";
import {
  fetchSites,
  getHasVaccine,
  getHasReport,
  getCoord,
} from "./data/locations.js";
import zipCodes from "./json/zipCodes.json";

import { addSitesToPage } from "./sites.js";
import { addLocation, clearMap } from "./map.js";

window.addEventListener("load", loaded);

let lastSearch;

function extractZip(zipInput) {
  // Extract the five-digit component from a five- or nine-digit zip surrounded
  // by optional whitespace.  This syntax isn't enforced by a pattern attribute,
  // because then the pattern would have to be copied in more than one place.
  let matches = zipInput.value.match(/^\s*(\d{5})(?:-\d{4})?\s*$/);
  if (!matches) {
    return null;
  }

  return matches[1];
}

function loaded() {
  fetchSites();

  const zipForm = document.getElementById("submit_zip_form");
  const zipInput = document.getElementById("js_zip_or_county");
  if (zipInput) {
    let timeoutId;
    // If a user clears the search field and hits enter, reset to unfiltered table
    zipInput.addEventListener("keyup", (e) => {
      toggleGeoLocationVisibility(e.target.value.length === 0);
    });

    zipInput.addEventListener("input", (e) => {
      // Calculate validity of the input.
      if (extractZip(zipInput)) {
        zipInput.setCustomValidity(""); // valid
      } else {
        zipInput.setCustomValidity(window.messageCatalog["nearest_js_enter_valid_zipcode"]);
      }
    });

    zipInput.addEventListener("focus", () => {
      clearTimeout(timeoutId);
      if (zipInput.value.length === 0) {
        toggleGeoLocationVisibility(true);
      }
      toggleElementVisibility("js_my_location", false);
    });
    zipInput.addEventListener("blur", (e) => {
      clearTimeout(timeoutId);
      setTimeout(() => {
        toggleGeoLocationVisibility(false);
      }, 200);

      // Show my location again if it was used for the last search
      if (!zipInput.value.length && lastSearch == "geolocation") {
        toggleElementVisibility("js_my_location", true);
      }
    });
  }
  if (!zipForm || zipForm.getAttribute("action") !== location.pathname) {
    return;
  }

  handleUrlParamOnLoad();
  addListeners();
}

function toggleElementVisibility(elementId, isVisible) {
  const elem = document.getElementById(elementId);
  if (!elem) return;
  if (isVisible) {
    elem.classList.remove("hidden");
  } else {
    elem.classList.add("hidden");
  }
}

function toggleGeoLocationVisibility(isVisible) {
  toggleElementVisibility("submit_geolocation", isVisible);
}

function handleUrlParamOnLoad() {
  const urlParams = new URLSearchParams(window.location.search);
  const zip = urlParams.get("zip");
  if (zip) {
    const zipInput = document.getElementById("js_zip_or_county");
    if (zipInput) {
      zipInput.value = zip;
    }
    handleSearch(undefined, "zip");
  }
  if (urlParams.get("locate")) {
    handleSearch(undefined, "geolocation");
  }
}

function addListeners() {
  document.getElementById("submit_zip_form").addEventListener("submit", (e) => {
    try {
      e.target.checkValidity();
    } catch (err) {
      console.error(err);
    }
    handleSearch(e, "zip");
  });

  const geoLocationElem = document.getElementById("submit_geolocation");
  if (geoLocationElem) {
    if (navigator.geolocation) {
      geoLocationElem.addEventListener("click", (e) => {
        handleSearch(e, "geolocation");
      });
    } else {
      geoLocationElem.remove();
    }
  }
  const filterElem = document.getElementById("filter");
  if (filterElem) {
    filterElem.addEventListener("change", (e) => {
      if (lastSearch) {
        handleSearch(undefined, lastSearch);
      }
    });
  }

  document.addEventListener("mapInit", () => {
    window.map.addListener(
      "center_changed",
      debounce(() => mapMovement())
    );
  });
}

function mapMovement() {
  const newCoord = {
    latitude: window.map.getCenter().lat(),
    longitude: window.map.getCenter().lng(),
  };
  updateSitesFromCoordinates(newCoord, false);
}

function toggleLoading(shouldShow) {
  const elem = document.getElementById("loading");
  if (shouldShow) {
    elem.classList.remove("hidden");
    document.getElementById("post_list_container").classList.remove("hidden");
  } else {
    elem.classList.add("hidden");
    document.getElementById("post_list_container").classList.remove("hidden");
  }
}

async function handleSearch(event, type) {
  if (event) {
    event.preventDefault();
  }
  toggleLoading(true);
  lastSearch = type;
  const zipInput = document.getElementById("js_zip_or_county");
  switch (type) {
    case "zip":
      const zip = extractZip(zipInput);
      if (zip) {
        await submitZip(zip);
        sendAnalyticsEvent("Search Zip", "Vaccine Sites", "", zip);
      }
      break;
    case "geolocation":
      toggleElementVisibility("js_my_location", true);
      zipInput.value = "";
      await submitGeoLocation();
      sendAnalyticsEvent("Locate Me", "Vaccine Sites", "", "");
      break;
    default:
      toggleLoading(false);
      throw new Error("Search type is invalid");
  }
  toggleLoading(false);
}

async function submitZip(zip) {
  const button = document.getElementById("submit_zip");
  toggleSubmitButtonState(button, false);
  await lookup(zip);
  toggleSubmitButtonState(button, true);
}

function toggleSubmitButtonState(button, isEnabled) {
  if (isEnabled) {
    button.disabled = false;
    button.classList.remove("cursor-wait");
  } else {
    button.disabled = true;
    button.classList.add("cursor-wait");
  }
}

async function submitGeoLocation() {
  const button = document.getElementById("submit_geolocation");
  toggleSubmitButtonState(button, false);
  button.value = "Locating...";

  const onFinish = () => {
    toggleSubmitButtonState(button, true);
  };

  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      async function onSuccess(position) {
        const coordinates = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };
        await updateSitesFromCoordinates(coordinates);
        onFinish();
        resolve();
      },
      function onError(e) {
        Sentry.captureException(e);
        alert(window.messageCatalog["nearest_js_alert_detect"]);
        onFinish();
        resolve();
      },
      {
        maximumAge: 1000 * 60 * 5, // 5 minutes
        timeout: 1000 * 15, // 15 seconds
      }
    );
  });
}

async function updateSitesFromCoordinates(coordinates, repositionMap = true) {
  await fetchFilterAndSortSites(coordinates, repositionMap);
}

async function lookup(zip) {
  const data = zipCodes[zip];
  if (!data) {
    alert(window.messageCatalog["nearest_js_alert_zipcode"]);
    return;
  }
  const coordinate = data.coordinates;
  return fetchFilterAndSortSites(coordinate);
}

async function fetchFilterAndSortSites(userCoord, repositionMap = true) {
  const list = document.getElementById("sites");
  list.innerHTML = "";
  let sites = await fetchSites();
  sites = sites.filter((s) => s.Latitude && s.Longitude);
  const filterElem = document.querySelector("#filter");
  const filter = filterElem ? filterElem.value : "stocked";

  if (filter == "reports") {
    sites = sites.filter((site) => {
      return getHasReport(site);
    });
  } else if (filter == "stocked") {
    sites = sites.filter((site) => {
      return getHasVaccine(site);
    });
  }

  for (const site of sites) {
    const siteCoord = getCoord(site);
    const distance = distanceBetweenCoordinates(userCoord, siteCoord);
    site.distance = distance;
  }

  sites.sort((a, b) => a.distance - b.distance);
  if (repositionMap) {
    updateMap(userCoord, sites, true);
  }
  addSitesToPage(sites, "sites");
}

function updateMap(coord, sites, repositionMap = true) {
  const map = window.map;
  if (map) {
    if (repositionMap) {
      const mapCoord = {
        lat: coord.latitude,
        lng: coord.longitude,
      };
      map.setCenter(mapCoord);
      map.setZoom(10);
    }

    clearMap();
    sites.forEach((site) => {
      addLocation(site);
    });
  } else {
    // If the map is missing, listen for it to be initialized and then retry
    document.addEventListener("mapInit", () =>
      updateMap(coord, sites, repositionMap)
    );
  }
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

// https://www.freecodecamp.org/news/javascript-debounce-example/
function debounce(func, timeout = 300) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      // eslint-disable-next-line no-invalid-this
      func.apply(this, args);
    }, timeout);
  };
}
