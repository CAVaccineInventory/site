import { fetchSites, getHasVaccine, getCoord } from "./data/locations.js";
import { t } from "./i18n";
import { addLocation, tryOrDelayToMapInit } from "./map.js";
import {
  addSitesOrHideIfEmpty,
  getSelectedSiteId,
  selectSite,
} from "./sites.js";
import sendAnalyticsEvent from "./sendAnalyticsEvent";
import embeddedMapControlsTemplate from "./templates/embeddedMapControls.handlebars";
import { debounce, distanceBetweenCoordinates } from "./util.js";

window.addEventListener("load", loaded);
async function loaded() {
  const sites = await fetchSites();
  window.filteredSites = sites.filter(getHasVaccine);

  tryOrDelayToMapInit(() => {
    configureMap();
    filteredSites.forEach(addLocation);
    window.map.addListener(
      "bounds_changed",
      debounce(() => {
        updateSitesFromMap();
        updateUrlParametersFromMap();
      })
    );
  });

  updateSitesFromMap();
}

function moveMap(coordinates) {
  tryOrDelayToMapInit((map) => {
    const mapCoord = {
      lat: coordinates.latitude,
      lng: coordinates.longitude,
    };
    map.setCenter(mapCoord);
    map.setZoom(13);
  });
}

function configureMap() {
  const searchContainer = document.createElement("div");
  searchContainer.classList.add("custom-map-container");
  searchContainer.innerHTML = embeddedMapControlsTemplate();

  const searchInput = searchContainer.querySelector("#search-input");
  window.map.controls[google.maps.ControlPosition.TOP_CENTER].push(
    searchContainer
  );

  const autocomplete = new google.maps.places.Autocomplete(searchInput, {
    componentRestrictions: { country: "us" },
    fields: ["geometry"],
    origin: window.map.getCenter(),
    strictBounds: false,
  });
  autocomplete.bindTo("bounds", window.map);

  function zoomToPlace(place) {
    window.map.setCenter(place.geometry.location);
    window.map.setZoom(13);
    sendAnalyticsEvent("Search Place", "Embed", "", "");
  }

  function alertAboutUnknownPlace(place) {
    sendAnalyticsEvent("Unable to find place", "Embed", "", "");
    alert(t("embed.unable_to_find_location") + ": " + place.name);
  }

  autocomplete.addListener("place_changed", () => {
    const place = autocomplete.getPlace();
    if (place.geometry && place.geometry.location) {
      zoomToPlace(place);
      return;
    }
    // The user entered the name of a place that was not suggested and
    // pressed the Enter key, or the Place Details request failed.

    // We'll hit the places autocomplete service directly and hopefully that will give us
    // something. This is designed to match the query the autocomplete component does
    // so hopefully we're picking the top result (even though the user never hit DOWN)
    const placesAutocompleteService = new google.maps.places.AutocompleteService();
    const placesAutocompleteQuery = {
      input: place.name,
      bounds: window.map.getBounds(),
      componentRestrictions: { country: "us" },
      origin: window.map.getCenter(),
    };
    placesAutocompleteService.getPlacePredictions(
      placesAutocompleteQuery,
      function (results, status) {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
          // We have a place, but we need to do another round trip to get its map location.
          const placesService = new google.maps.places.PlacesService(
            window.map
          );
          const placesDetailsQuery = {
            placeId: results[0].place_id,
            fields: ["name", "geometry"],
          };
          placesService.getDetails(
            placesDetailsQuery,
            function (result, status) {
              if (status === google.maps.places.PlacesServiceStatus.OK) {
                zoomToPlace(result);
                // Update the search input to show the user how we resolved their query.
                searchInput.value = result.name;
              } else {
                alertAboutUnknownPlace(place);
              }
            }
          );
        } else {
          alertAboutUnknownPlace(place);
        }
      }
    );
  });

  const autolocateButton = searchContainer.querySelector("#autolocate-button");
  autolocateButton.addEventListener("click", () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        moveMap(position.coords);
        sendAnalyticsEvent("Locate Me", "Embed", "", "");
      },
      () => {
        sendAnalyticsEvent("Unable to detect location", "Embed", "", "");
        alert(t("embed.failed_to_detect_location"));
      }
    );
  });
}

function updateUrlParametersFromMap() {
  const center = window.map.getCenter();
  const url = new URL(window.location.href);
  url.searchParams.set("lat", center.lat());
  url.searchParams.set("lng", center.lng());
  url.searchParams.set("zoom", window.map.zoom);
  window.history.replaceState(null, null, url.toString());
}

function updateSitesFromMap() {
  // If we get called before we've properly filtered sites on the map, skip this call
  // for now (and we'll populate this later)
  if (!window.filteredSites) {
    return;
  }

  // Grab the selected site id before we clear the list
  const selectedSiteId = getSelectedSiteId();

  document
    .querySelectorAll(".js-sites")
    .forEach((site) => (site.innerHTML = ""));

  const bounds = window.map.getBounds();
  const sitesToShow = window.filteredSites.filter((site) => {
    const { latitude, longitude } = getCoord(site);
    if (!latitude || !longitude) {
      return false;
    }

    return bounds.contains({ lat: latitude, lng: longitude });
  });

  const center = {
    latitude: window.map.getCenter().lat(),
    longitude: window.map.getCenter().lng(),
  };
  sitesToShow.sort(
    (a, b) =>
      distanceBetweenCoordinates(center, getCoord(a)) -
      distanceBetweenCoordinates(center, getCoord(b))
  );

  addSitesOrHideIfEmpty(sitesToShow.slice(0, 50), "js-sites-with-vaccine");

  // If there's a selected site before the refresh, scroll to it.
  // Otherwise, scroll back to the top.
  if (document.getElementById(selectedSiteId)) {
    selectSite(selectedSiteId);
  } else {
    window.scrollTo({
      left: 0,
      top: 0,
      behavior: "smooth",
    });
  }
}
