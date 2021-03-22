import sendAnalyticsEvent from "./sendAnalyticsEvent";
import {
  fetchSites,
  getHasVaccine,
  getHasReport,
  sortByRecency,
  splitSitesByVaccineState,
  filterSitesByAvailability,
  getCoord,
} from "./data/locations.js";
import zipCodes from "./json/zipCodes.json";

import { addSitesOrHideIfEmpty } from "./sites.js";
import { addLocation, clearMap, tryOrDelayToMapInit } from "./map.js";

window.addEventListener("load", loaded);

let lastSearch;

function extractZip(zipInput) {
  // Extract the five-digit component from a five- or nine-digit zip surrounded
  // by optional whitespace.  This syntax isn't enforced by a pattern attribute,
  // because then the pattern would have to be copied in more than one place.
  const matches = zipInput.value.match(/^\s*(\d{5})(?:-\d{4})?\s*$/);
  if (!matches) {
    return null;
  }

  return matches[1];
}

function loaded() {
  fetchSites();

  const zipForm = document.getElementById("js-submit-zip-form");
  const zipInput = document.getElementById("js-zip-or-county");
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
        zipInput.setCustomValidity(
          window.messageCatalog["nearest_js_enter_valid_zipcode"]
        );
      }
    });

    zipInput.addEventListener("focus", () => {
      clearTimeout(timeoutId);
      if (zipInput.value.length === 0) {
        toggleGeoLocationVisibility(true);
      }
      toggleElementVisibility("js-my-location", false);
    });
    zipInput.addEventListener("blur", (e) => {
      clearTimeout(timeoutId);
      setTimeout(() => {
        toggleGeoLocationVisibility(false);
      }, 200);

      // Show my location again if it was used for the last search
      if (!zipInput.value.length && lastSearch == "geolocation") {
        toggleElementVisibility("js-my-location", true);
      }
    });
  }
  if (!zipForm || zipForm.getAttribute("action") !== location.pathname) {
    return;
  }

  addListeners();
  document.addEventListener("mapInit", () => {
    handleUrlParamOnLoad();
  });
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
  toggleElementVisibility("js-submit-geolocation", isVisible);
}

function handleUrlParamOnLoad() {
  const urlParams = new URLSearchParams(window.location.search);
  const zip = urlParams.get("zip");
  if (zip) {
    const zipInput = document.getElementById("js-zip-or-county");
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
  document
    .getElementById("js-submit-zip-form")
    .addEventListener("submit", (e) => {
      try {
        e.target.checkValidity();
      } catch (err) {
        console.error(err);
      }
      handleSearch(e, "zip");
    });

  const geoLocationElem = document.getElementById("js-submit-geolocation");
  if (geoLocationElem) {
    if (navigator.geolocation) {
      geoLocationElem.addEventListener("click", (e) => {
        handleSearch(e, "geolocation");
      });
    } else {
      geoLocationElem.remove();
    }
  }

  const filterElem = document.getElementById("js-nearest-filter");
  const availabilityFilterElem = document.getElementById(
    "js-availability-filter"
  );

  if (filterElem) {
    filterElem.addEventListener("change", (e) => {
      if (lastSearch) {
        updateSitesOnMap();
        handleSearch(undefined, lastSearch);
      }
    });
  }

  if (availabilityFilterElem) {
    availabilityFilterElem.addEventListener("change", (e) => {
      if (lastSearch) {
        updateSitesOnMap();
        handleSearch(undefined, lastSearch);
      }
    });
  }

  document.addEventListener("mapInit", () => {
    window.map.addListener(
      "bounds_changed",
      debounce(() => updateSitesFromMap())
    );
  });
}

function toggleLoading(shouldShow) {
  const elem = document.getElementById("js-loading");
  if (shouldShow) {
    elem.classList.remove("hidden");
    document
      .getElementById("js-post-list-container")
      .classList.remove("hidden");
  } else {
    elem.classList.add("hidden");
    document
      .getElementById("js-post-list-container")
      .classList.remove("hidden");
  }
}

async function updateSitesOnMap() {
  window.filteredSites = await fetchSites();

  const filterElement = document.getElementById("js-nearest-filter");
  const filter = filterElement ? filterElement.value : "any";

  const availabilityFilterElem = document.getElementById(
    "js-availability-filter"
  );

  if (filter === "reports") {
    availabilityFilterElem.classList.add("hidden");
    filteredSites = filteredSites.filter((site) => {
      return getHasReport(site);
    });
  } else if (filter === "any") {
    availabilityFilterElem.classList.add("hidden");
  } else {
    // Only "stocked", so lets show the additional filters and use them
    availabilityFilterElem.classList.remove("hidden");

    filteredSites = filteredSites.filter((site) => {
      return getHasVaccine(site);
    });

    const filters = [];

    const ageFilter = document.getElementById("js-age-filter");
    if (ageFilter) {
      const ageChosen = ageFilter.value;
      // Heads up, we're relying on switch statement cascading here!
      switch (ageChosen) {
        case "none":
        case "85":
          filters.push("Yes: vaccinating 85+");
        case "80":
          filters.push("Yes: vaccinating 80+");
        case "75":
          filters.push("Yes: vaccinating 75+");
        case "70":
          filters.push("Yes: vaccinating 70+");
        case "65":
          filters.push("Yes: vaccinating 65+");
        case "50":
          filters.push("Yes: vaccinating 50+");
        case "16":
          filters.push("Yes: vaccinating 18+");
          filters.push("Yes: vaccinating 16+");
      }
    }

    const eligiblityFilter = document.getElementById("js-eligibility-filter");
    if (eligiblityFilter) {
      const fields = {
        education: "Vaccinating education and childcare workers",
        food: "Vaccinating agriculture and food workers",
        emergency: "Vaccinating emergency services workers",
      };

      const criteriaChosen = eligiblityFilter.value;

      switch (criteriaChosen) {
        case "any":
          for (const prop in fields) {
            if (fields.hasOwnProperty(prop)) {
              filters.push(fields[prop]);
            }
          }
          break;
        case "none":
          break;
        default:
          filters.push(fields[criteriaChosen]);
      }
    }
    const highRiskFilter = document.getElementById("js-high-risk-filter");
    if (highRiskFilter && highRiskFilter.checked) {
      filters.push("Vaccinating high-risk individuals");
    }

    const veteranFilter = document.getElementById("js-veteran-filter");
    if (veteranFilter && veteranFilter.checked) {
      filters.push("Yes: must be a veteran");
    }

    filteredSites = filterSitesByAvailability(filteredSites, filters);
  }

  tryOrDelayToMapInit((map) => {
    clearMap();
    filteredSites.forEach((site) => {
      addLocation(site);
    });
  });

  updateSitesFromMap();
}

function updateUrl(key, value) {
  const url = new URL(window.location.href);
  // Delete location keys and set the new one again
  url.searchParams.delete("zip");
  url.searchParams.delete("locate");
  url.searchParams.set(key, value);
  if (url.toString() !== window.location.href) {
    window.history.pushState(null, null, url);
  }
}

async function handleSearch(event, type) {
  if (event) {
    event.preventDefault();
  }
  // Hide the alert. If it's already hidden, this won't do anything.
  document.getElementById("js-unknown-zip-code-alert").classList.add("hidden");
  toggleLoading(true);
  lastSearch = type;
  const zipInput = document.getElementById("js-zip-or-county");
  switch (type) {
    case "zip":
      const zip = extractZip(zipInput);
      if (zip) {
        updateUrl("zip", zip);
        await submitZip(zip);
        sendAnalyticsEvent("Search Zip", "Vaccine Sites", "", zip);
      }
      break;
    case "geolocation":
      toggleElementVisibility("js-my-location", true);
      updateUrl("locate", 1);
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
  const button = document.getElementById("js-submit-zip");
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
  const button = document.getElementById("js-submit-geolocation");
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
        await moveMap(coordinates);
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

async function lookup(zip) {
  const data = zipCodes[zip];
  if (!data) {
    // Display an alert.
    document
      .getElementById("js-unknown-zip-code-alert")
      .classList.remove("hidden");
    return;
  }
  const coordinate = data.coordinates;
  return moveMap(coordinate);
}

async function updateSitesFromMap() {
  // If we get called before we've properly filtered sites on the map, lets
  // make sure we do that.
  if (!window.filteredSites) {
    updateSitesOnMap();
    return;
  }

  document
    .querySelectorAll(".js-sites")
    .forEach((site) => (site.innerHTML = ""));

  const bounds = window.map.getBounds();
  let sitesToShow = window.filteredSites.filter((site) => {
    const { latitude, longitude } = getCoord(site);
    if (!latitude || !longitude) {
      return false;
    }

    return bounds.contains({ lat: latitude, lng: longitude });
  });

  // If we cull too many sites from the bounds check, lets populate it with
  // proximity
  if (sitesToShow.length < 50) {
    sitesToShow = window.filteredSites;

    for (const site of sitesToShow) {
      const center = {
        latitude: window.map.getCenter().lat(),
        longitude: window.map.getCenter().lng(),
      };
      const siteCoord = getCoord(site);
      site.distance = distanceBetweenCoordinates(center, siteCoord);
    }

    sitesToShow.sort((a, b) => a.distance - b.distance);

    sitesToShow = sitesToShow.slice(0, 150);
  }

  sortByRecency(sitesToShow);

  let {
    sitesWithVaccine,
    sitesWithoutVaccine,
    sitesWithNoReport,
  } = splitSitesByVaccineState(sitesToShow);

  sitesWithVaccine = sitesWithVaccine.slice(0, 50);
  sitesWithoutVaccine = sitesWithoutVaccine.slice(0, 50);
  sitesWithNoReport = sitesWithNoReport.slice(0, 50);

  addSitesOrHideIfEmpty(sitesWithVaccine, "js-sites-with-vaccine");
  addSitesOrHideIfEmpty(sitesWithoutVaccine, "js-sites-without-vaccine");
  addSitesOrHideIfEmpty(sitesWithNoReport, "js-sites-without-report");
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
