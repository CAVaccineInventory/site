import {
  fetchSites,
  splitSitesByVaccineState,
  sortByRecency,
  getCounty,
} from "./data.js";

import { addSitesToPage } from "./sites.js";

window.addEventListener("load", fetchCountySites);

function addSitesOrRemoveIfEmpty(sites, containerId) {
  if (!sites.length) {
    const container = document.getElementById(containerId);
    container.parentElement.remove();
  } else {
    addSitesToPage(sites, containerId);
  }
}

async function fetchCountySites() {
  let sites = await fetchSites();
  const county = document.getElementById("county_name").textContent.trim();

  // Filter by this page's county.
  sites = sites.filter((site) => {
    return [county, county + " County"].includes(getCounty(site));
  });

  sortByRecency(sites);

  const {
    sitesWithVaccine,
    sitesWithoutVaccine,
    sitesWithNoReport,
  } = splitSitesByVaccineState(sites);

  addSitesOrRemoveIfEmpty(sitesWithVaccine, "sitesWithVaccine");
  addSitesOrRemoveIfEmpty(sitesWithoutVaccine, "sitesWithoutVaccine");
  addSitesOrRemoveIfEmpty(sitesWithNoReport, "sitesWithoutReport");
}
