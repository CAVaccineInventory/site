import { getDisplayableVaccineInfo } from "/assets/js/data/locations.js";

window.mapMarkers = [];

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

function clearMap() {
  window.mapMarkers.forEach((marker) => {
    marker.setMap(null);
  });

  window.mapMarkers = [];
}

// State tracking for info cards
var prev_infowindow = false;

export { addLocation, clearMap };
