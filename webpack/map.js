import mapMarker from "./templates/mapMarker.handlebars";
import { getDisplayableVaccineInfo } from "./data/locations.js";
import { t } from "./i18n";

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
  marker.set('site', info);

  // Toggle the info card
  marker.addListener("click", () => {
    if (prevInfowindow) {
      prevInfowindow.close();
    }
    const markerContent = mapMarker({
      name: info.name,
      superSite: info.isSuperSite,
      details: info.status,
      schedulingInstructions: info.schedulingInstructions,
      address: info.address,
      reportNotes: info.reportNotes,
      superSiteLabel: t("global.super_site"),
      detailsLabel: t("global.details"),
      schedulingInstructionsLabel: t("global.appt_info"),
      addressLabel: t("global.address"),
      reportNotesLabel: t("global.latest_info"),
    });
    const infowindow = new google.maps.InfoWindow({
      content: markerContent,
    });

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

function tryOrDelayToMapInit(callback) {
  const map = window.map;
  if (map) {
    callback(map);
  } else {
    // If the map is missing, listen for it to be initialized and then retry
    document.addEventListener("mapInit", callback);
  }
}

document.addEventListener("siteCardSelected", (ev) => { 
  console.log(ev);
  const marker = window.mapMarkers.filter(m => m.site.id === ev.detail.siteId)[0];
  const info = marker.site;
  
  if (prevInfowindow) {
    prevInfowindow.close();
  }
  
  const markerContent = mapMarker({
    name: info.name,
    superSite: info.isSuperSite,
    details: info.status,
    schedulingInstructions: info.schedulingInstructions,
    address: info.address,
    reportNotes: info.reportNotes,
    superSiteLabel: t("global.super_site"),
    detailsLabel: t("global.details"),
    schedulingInstructionsLabel: t("global.appt_info"),
    addressLabel: t("global.address"),
    reportNotesLabel: t("global.latest_info"),
  });
  const infowindow = new google.maps.InfoWindow({
    content: markerContent,
  });

  if (prevInfowindow == infowindow) {
    prevInfowindow = false;
  } else {
    infowindow.open(map, marker);
    prevInfowindow = infowindow;
  }
});
// document.addEventListener("siteCardDeselected", (ev) => console.log(ev));

// State tracking for info cards
let prevInfowindow = false;

export { addLocation, clearMap, tryOrDelayToMapInit };
