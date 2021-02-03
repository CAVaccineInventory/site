import sendAnalyticsEvent from "./sendAnalyticsEvent";
import {
  fetchSites,
  getHasVaccine,
  getHasReport,
  getCoord,
  fetchZipCodesData,
} from "./data/locations.js";

import { addSitesToPage } from "./sites.js";
import { addLocation, clearMap } from "./map.js";

window.addEventListener("load", loaded);

let lastSearch;

function loaded() {
  fetchSites();
  fetchZipCodesData();

  const zipForm = document.getElementById("submit_zip_form");
  const zipInput = document.getElementById("js_zip_or_county");
  if (zipInput) {
    let timeoutId;
    // If a user clears the search field and hits enter, reset to unfiltered table
    zipInput.addEventListener("keyup", (e) => {
      toggleGeoLocationVisibility(e.target.value.length === 0);
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
      const zip = zipInput.value;
      await submitZip(zip);
      sendAnalyticsEvent("Search Zip", "Vaccine Sites", "", zip);
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
  if (zip.length < 5 || zip.length > 5) {
    alert("5 digit zip please");
  } else {
    const button = document.getElementById("submit_zip");
    toggleSubmitButtonState(button, false);
    await lookup(zip);
    toggleSubmitButtonState(button, true);
  }
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

async function coordinatesToCounty(coordinates) {
  const res = await fetch(
    `https://geo.fcc.gov/api/census/area?lat=${coordinates.latitude}&lon=${coordinates.longitude}&format=json`
  );
  const data = await res.json();

  if (
    data &&
    data.hasOwnProperty("results") &&
    Array.isArray(data.results) &&
    data.results.length > 1 &&
    data.results[0].hasOwnProperty("county_name")
  ) {
    return data.results[0].county_name;
  }
  return false;
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
        console.error(e);
        console.log(e.code, e.message);
        alert(e.message || window.messageCatalog["nearest_js_alert_detect"]);
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
  const county = await coordinatesToCounty(coordinates);
  await fetchFilterAndSortSites(coordinates, county, repositionMap);
}

async function lookup(zip) {
  const zipCodes = await fetchZipCodesData();
  let longitude;
  let latitude;
  let county;
  if (zipCodes[zip]) {
    const location = zipCodes[zip].coordinates;
    longitude = location.lng;
    latitude = location.lat;
    county = zipCodes[zip].county;
  } else {
    const geocodeURL = `https://public.opendatasoft.com/api/records/1.0/search/?dataset=us-zip-code-latitude-and-longitude&q=${zip}`;
    const response = await fetch(geocodeURL);

    if (!response.ok) {
      alert(window.messageCatalog["nearest_js_alert_zipcode"]);
      return;
    }

    const results = await response.json();
    if (results.nhits < 1) {
      alert(window.messageCatalog["nearest_js_alert_zipcode"]);
      return;
    }

    // Comes back in [long, lat]
    location = results.records[0].geometry.coordinates;
    longitude = location[0];
    latitude = location[1];
    try {
      const city = results.fields.city.toLowerCase();
      const zipToCounty = Object.values(zipCodes).find(
        (zipData) => zipData.city.toLowerCase() === city
      );
      if (zipToCounty) {
        county = zipToCounty.county;
      }
    } catch (e) {
      console.error(e);
    }
  }
  const coordinate = { longitude, latitude };
  return fetchFilterAndSortSites(coordinate, county);
}

async function fetchFilterAndSortSites(
  userCoord,
  county,
  repositionMap = true
) {
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
  addSitesToPage(sites, "sites", county);
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