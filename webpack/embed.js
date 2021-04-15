import {
  fetchSites,
  getHasVaccine,
  sortByRecency,
  getCoord,
} from "./data/locations.js";
import { addLocation, tryOrDelayToMapInit } from "./map.js";
import { addSitesOrHideIfEmpty } from "./sites.js";
import { debounce } from "./util.js";

window.addEventListener("load", loaded);
async function loaded() {
  const sites = await fetchSites();
  window.filteredSites = sites.filter(getHasVaccine);
  sortByRecency(filteredSites);

  tryOrDelayToMapInit(() => {
    filteredSites.forEach((site) => {
      addLocation(site);
    });
    window.map.addListener("bounds_changed", debounce(updateSitesFromMap));
  });

  await updateSitesFromMap();
}

async function updateSitesFromMap() {
  // If we get called before we've properly filtered sites on the map, skip this call
  // for now (and we'll populate this later)
  if (!window.filteredSites) {
    return;
  }

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

  sortByRecency(sitesToShow);
  await addSitesOrHideIfEmpty(sitesToShow, "js-sites-with-vaccine");
}
