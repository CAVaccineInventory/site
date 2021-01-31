import { getDisplayableVaccineInfo } from "/assets/js/data/locations.js";

window.mapMarkers = [];

function shouldUseSpecialPin(info) {
  return info.isSuperSite === true;
}

function addLocation(p) {
  const info = getDisplayableVaccineInfo(p);

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
  const marker = new google.maps.Marker(markerConfig);
  const infowindow = new google.maps.InfoWindow({
    content: `<div class="mapInfo">${infoText}</div>`,
  });

  // Toggle the info card
  marker.addListener("click", () => {
    if (prevInfowindow) {
      prevInfowindow.close();
    }

    if (prevInfowindow == infowindow) {
      prevInfowindow = false;
    } else {
      infowindow.open(map, marker);
      prevInfowindow = infowindow;
    }
  });

  window.mapMarkers.push(marker);
}

function clearMap() {
  window.mapMarkers.forEach((marker) => {
    marker.setMap(null);
  });

  window.mapMarkers = [];
}

// State tracking for info cards
let prevInfowindow = false;

export { addLocation, clearMap };
