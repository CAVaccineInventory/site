import mapMarker from "./templates/mapMarker.handlebars";
import { getDisplayableVaccineInfo } from "./data/locations.js";

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

  const markerLabels = JSON.parse(
    document.querySelector("#mapMarkerLabels").textContent
  );
  const markerContent = mapMarker({
    name: info.name,
    superSite: info.isSuperSite,
    details: info.status,
    schedulingInstructions: info.schedulingInstructions,
    address: info.address,
    reportNotes: info.reportNotes,
    superSiteLabel: markerLabels.superSite,
    detailsLabel: markerLabels.details,
    schedulingInstructionsLabel: markerLabels.apptInfo,
    addressLabel: markerLabels.address,
    reportNotesLabel: markerLabels.latestInfo,
  });

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
    content: markerContent,
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
