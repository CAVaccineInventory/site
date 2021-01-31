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

  const templateSource = document.querySelector("#map-marker").innerHTML;
  const markerTemplate = Handlebars.compile(templateSource);
  const markerContent = markerTemplate({
    name: info.name,
    superSite: info.isSuperSite,
    details: info.status,
    schedulingInstructions: info.schedulingInstructions,
    address: info.address,
    reportNotes: info.reportNotes,
  })

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
