import { getHasVaccine, getDisplayableVaccineInfo } from "/assets/js/data.js";

window.addEventListener("load", initMap);
// Setup global map var
window.map = {};
window.mapMarkers = [];

// Initialize and populate the map
function initMap() {
  const mapElement = document.getElementById("js_map");
  const map = new google.maps.Map(mapElement, {
    zoom: 6,
    center: { lng: -119.335893, lat: 37.25967 },
    mapTypeControl: false,
    streetViewControl: false,
  });
  window.map = map;

  let request = new XMLHttpRequest();
  request.open(
    "GET",
    "https://storage.googleapis.com/cavaccineinventory-sitedata/airtable-sync/Locations.json"
  );
  request.responseType = "json";
  request.onload = function () {
    request.response.forEach((p) => {
      if (!getHasVaccine(p)) {
        return;
      }

      addLocation(p)
    });
  };
  request.send();
  if ("locate" in mapElement.dataset) {
    setupLocateMe();
  }
}

function shouldUseSpecialPin(info) {
  return info.isSuperSite === true;
}

function addLocation(p) {
  let info = getDisplayableVaccineInfo(p);

  if (!info.latitude || !info.longitude) {
    console.log(`Missing lat/lon for ${info.name}!!`);
    return false;
  }

  // Format the info card
  let infoText = `<h1 class="text-green-600">${info.name}</h1>`;

  if (info.isSuperSite) {
    infoText += '<b class="text-lg supersite-tag">Super Site</b> <br />';
  }

  infoText += `<b>Details: </b> ${info.status}<br/>`;

  if (info.schedulingInstructions) {
    infoText += `<b>Appointment information: </b> ${info.schedulingInstructions} <br />`;
  }
  if (info.address) {
    infoText += `<b>Address:</b> ${info.address}<br />`;
  }
  if (info.reportNotes) {
    infoText += `<b>Latest info:</b> ${info.reportNotes}<br />`;
  }

  // Populate the marker and info card
  const markerConfig = {
    position: {
      lng: info.longitude,
      lat: info.latitude,
    },
    map: map,
    title: info.name,
  };

  const bluePin = "/assets/img/blue-pin.png";
  if (shouldUseSpecialPin(info)) {
    markerConfig["icon"] = bluePin;
  }
  let marker = new google.maps.Marker(markerConfig);
  let infowindow = new google.maps.InfoWindow({
    content: `<div class="mapInfo">${infoText}</div>`,
  });

  // Toggle the info card
  marker.addListener("click", () => {
    if (prev_infowindow) {
      prev_infowindow.close();
    }

    if (prev_infowindow == infowindow) {
      prev_infowindow = false;
    } else {
      infowindow.open(map, marker);
      prev_infowindow = infowindow;
    }
  });

  window.mapMarkers.push(marker);
}

function setupLocateMe() {
  const map = window.map;

  if (!navigator.geolocation) {
    console.warn("navigator not supported");
  }
  const template = document.getElementById("locate_me_template");
  const locationButton = template.content
    .cloneNode(true)
    .getElementById("locate_me");
  locationButton.textContent = "Locate around me!";
  map.controls[google.maps.ControlPosition.TOP_CENTER].push(locationButton);
  locationButton.addEventListener("click", () => {
    if (navigator.geolocation) {
      locationButton.textContent = "Locating...";
      navigator.geolocation.getCurrentPosition(
        (position) => {
          locationButton.textContent = "Locate around me!";
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          map.setCenter(pos);
          map.setZoom(10);
        },
        (e) => {
          console.warn(e);
          locationButton.textContent = "Failed, please try again";
        },
        {
          maximumAge: 1000 * 60 * 5, // 5 minutes
          timeout: 1000 * 20, // 20 seconds
          enableHighAccuracy: false,
        }
      );
    } else {
      console.error("Geolocation not supported");
    }
  });
}

function clearMap() {
  window.mapMarkers.forEach((marker) => {
    marker.setMap(null);
  });

  window.mapMarkers = [];
}

// State tracking for info cards
var prev_infowindow = false;

export {
  addLocation,
  clearMap
}
