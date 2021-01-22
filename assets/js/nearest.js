import { fetchSites, getHasVaccine, getHasReport, getCoord } from "./data.js";

import { addSitesToPage } from "./sites.js";

window.addEventListener("load", loaded);

function loaded() {
  document.getElementById("submit_zip").addEventListener("submit", (e) => {
    try {
      e.target.checkValidity();
    } catch (err) {
      console.error(err);
    }
    handleSearch(e, "zip");
  });

  if (navigator.geolocation) {
    document.getElementById("geolocation_wrapper").classList.remove("hidden");
    document
      .getElementById("submit_geolocation")
      .addEventListener("click", (e) => handleSearch(e, "geolocation"));
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

async function handleSearch(event, type) {
  event.preventDefault();
  toggleLoading(true);
  const list = document.getElementById("sites");
  list.innerHTML = "";
  switch (type) {
    case "zip":
      await submitZip();
      break;
    case "geolocation":
      await submitGeoLocation();
      break;
    default:
      toggleLoading(false);
      throw new Error("Search type is invalid");
  }
  toggleLoading(false);
}

async function submitZip() {
  const zip = document.getElementById("zip").value;
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
        await fetchFilterAndSortSites(coordinates);
        onFinish();
        resolve();
      },
      function onError(e) {
        console.error(e);
        console.log(e.code, e.message);
        alert(
          e.message ||
            "Failed to detect your location. Please try again or enter your zip code"
        );
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
  const geocodeURL = `https://public.opendatasoft.com/api/records/1.0/search/?dataset=us-zip-code-latitude-and-longitude&q=${zip}`;

  let response = await fetch(geocodeURL);

  if (!response.ok) {
    alert("Failed to locate your zip code, please try again");
    return;
  }

  let results = await response.json();

  const loc = results.records[0].geometry.coordinates;
  // Comes back in [long, lat]
  const coordinate = {
    longitude: loc[0],
    latitude: loc[1],
  };

  return fetchFilterAndSortSites(coordinate);
}

async function fetchFilterAndSortSites(userCoord) {
  let sites = await fetchSites();
  const filter = document.querySelector("#filter").value;

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
  addSitesToPage(sites, "sites");
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
