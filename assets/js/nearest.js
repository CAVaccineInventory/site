import {
  fetchSites,
  getHasVaccine,
  getHasReport,
  getCoord,
  fetchZipCodesData,
} from "./data.js";

import { addSitesToPage } from "./sites.js";

import { getMessageCatalog } from "./message-catalog.js";

window.addEventListener("load", loaded);

function loaded() {
  fetchSites();
  fetchZipCodesData();

  const zipForm = document.getElementById("submit_zip_form");
  const zipInput = document.getElementById("zip");
  if (zipInput) {
    let timeoutId;
    zipInput.addEventListener("focus", () => {
      clearTimeout(timeoutId);
      toggleGeoLocationVisibility(true);
    });
    zipInput.addEventListener("blur", (e) => {
      clearTimeout(timeoutId);
      setTimeout(() => {
        toggleGeoLocationVisibility(false);
      }, 200);
    });
  }
  if (!zipForm || zipForm.getAttribute("action") !== location.pathname) {
    return;
  }

  handleUrlParamOnLoad();
  addListeners();
}

function toggleGeoLocationVisibility(isVisible) {
  const geoLocationElem = document.getElementById("submit_geolocation");
  if (!geoLocationElem) return;
  if (isVisible) {
    geoLocationElem.classList.remove("hidden");
  } else {
    geoLocationElem.classList.add("hidden");
  }
}

function handleUrlParamOnLoad() {
  const urlParams = new URLSearchParams(window.location.search);
  const zip = urlParams.get("zip");
  if (zip) {
    const zipInput = document.getElementById("zip");
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
      document;
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

let lastSearch;

async function handleSearch(event, type) {
  if (event) {
    event.preventDefault();
  }
  toggleLoading(true);
  const list = document.getElementById("sites");
  list.innerHTML = "";
  lastSearch = type;
  switch (type) {
    case "zip":
      let zip = document.getElementById("zip").value;
      await submitZip(zip);
      sendAnalyticsEvent("Search Zip", "Vaccine Sites", "", zip);
      break;
    case "geolocation":
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
  return data.results[0].county_name;
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
        let county;
        try {
          county = await coordinatesToCounty(coordinates);
        } catch (e) {
          console.error("Failed to get county", e);
        }
        await fetchFilterAndSortSites(coordinates, county);
        onFinish();
        resolve();
      },
      function onError(e) {
        console.error(e);
        console.log(e.code, e.message);
        alert(e.message || getMessageCatalog()["nearest_js_alert_zipcode"]);
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
    let response = await fetch(geocodeURL);

    if (!response.ok) {
      alert(getMessageCatalog()["nearest_js_alert_zipcode"]);
      return;
    }

    let results = await response.json();

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

async function fetchFilterAndSortSites(userCoord, county) {
  let sites = await fetchSites();
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
    let siteCoord = getCoord(site);
    const distance = distanceBetweenCoordinates(userCoord, siteCoord);
    site.distance = distance;
  }

  sites.sort((a, b) => a.distance - b.distance);
  addSitesToPage(sites, "sites", county);
}

// https://github.com/skalnik/aqi-wtf/blob/main/app.js#L238-L250
function distanceBetweenCoordinates(coord1, coord2) {
  const p = Math.PI / 180;
  var a =
    0.5 -
    Math.cos((coord2.latitude - coord1.latitude) * p) / 2 +
    (Math.cos(coord1.latitude * p) *
      Math.cos(coord2.latitude * p) *
      (1 - Math.cos((coord2.longitude - coord1.longitude) * p))) /
      2;
  // 12742 is the diameter of earth in km
  return 12742 * Math.asin(Math.sqrt(a));
}
