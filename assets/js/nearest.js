import {
  fetchSites,
  getDisplayableVaccineInfo,
  getHasVaccine,
  getHasReport,
  getCoord,
} from "./data.js";

window.addEventListener("load", loaded);

function loaded() {
  document.querySelector("#submit").addEventListener("click", submitZip);
  document
    .querySelector("#use-geolocation")
    .addEventListener("click", submitGeoLocation);
}

function submitZip(event) {
  event.preventDefault();

  const zip = document.querySelector("#zip").value;
  if (zip.length < 5 || zip.length > 5) {
    alert("5 digit zip please");
  } else {
    lookup(zip);
  }
}

function submitGeoLocation(event) {
  event.preventDefault();
  const button = document.querySelector("#use-geolocation");
  const defaultValue = button.value;

  if (!navigator.geolocation) {
    button.value = "Your browser does not support geolocation";
    button.disabled = true;
  } else {
    button.disabled = true;
    button.value = "Locating...";
    navigator.geolocation.getCurrentPosition(
      async function onSuccess(position) {
        const coordinates = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };
        button.value = defaultValue;
        button.disabled = false;
        await fetchFilterAndSortSites(coordinates);
      },
      function onError() {
        button.value = "Could not fetch geolocation";
      }
    );
  }
}

async function lookup(zip) {
  const geocodeURL = `https://public.opendatasoft.com/api/records/1.0/search/?dataset=us-zip-code-latitude-and-longitude&q=${zip}`;

  let response = await fetch(geocodeURL);

  if (!response.ok) {
    alert("AHHHH");
    return;
  }

  let results = await response.json();

  const loc = results.records[0].geometry.coordinates;
  // Comes back in [long, lat]
  const coordinate = {
    longitude: loc[0],
    latitude: loc[1],
  };

  fetchFilterAndSortSites(coordinate);
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
  addSitesToPage(sites);
}

function addSitesToPage(sites) {
  const list = document.querySelector("#sites");
  list.innerHTML = "";
  for (const site of sites.slice(0, 50)) {
    let info = getDisplayableVaccineInfo(site);
    let html = '<li class="shadow sm:rounded-lg px-2 lg:py-6 mt-4">';
    html += `<h4 class="text-lg leading-6 font-medium text-gray-900">${info.name}<h4>`;

    // Some sites don't have addresses.
    if (info.address) {
      html += `<p class="mt-1 max-w-2xl text-sm text-gray-500">
        ${info.address}
      </p>`;
    }

    html += `<div class="border-t border-gray-200"><dl>`;

    // Show whatever report we have
    if (info.hasReport) {
      html +=
        '<div class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">';
      html += '<dt class="text-sm font-medium text-gray-500">Details</dt>';
      html += `<dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">${info.status}</dd>`;

      if (info.schedulingInstructions) {
        html +=
          '<dt class="text-sm font-medium text-gray-500">Appointment Information</dt>';
        html += `<dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">${info.schedulingInstructions}</dd>`;
      }
      if (info.locationNotes) {
        html +=
          '<dt class="text-sm font-medium text-gray-500">Location notes</dt>';
        html += `<dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">${info.locationNotes}</dd>`;
      }
      if (info.reportNotes) {
        html +=
          '<dt class="text-sm font-medium text-gray-500">Latest info</dt>';
        html += `<dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">${info.reportNotes}</dd>`;
      }
    } else {
      html += `<p>No contact reports</p>`;
    }

    html += "</dl></div></li>";

    list.innerHTML += html;
  }
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
