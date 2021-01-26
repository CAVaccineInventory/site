import { fetchSites, splitSitesByVaccineState, getCounty } from "./data.js";

import { addSitesToPage } from "./sites.js";

window.addEventListener("load", fetchCountySites);

async function fetchCountySites() {
  let sites = await fetchSites();
  const county = document.getElementById("county_name").textContent.trim();

  // Filter by this page's county.
  sites = sites.filter((site) => {
    return [county, county + " County"].includes(getCounty(site));
  });

  const {
    sitesWithVaccine,
    sitesWithoutVaccine,
    sitesWithNoReport,
  } = splitSitesByVaccineState(sites);

  addSitesToPage(sitesWithVaccine, "sitesWithVaccine");
  addSitesToPage(sitesWithoutVaccine, "sitesWithoutVaccine");
  addSitesToPage(sitesWithNoReport, "sitesWithoutReport");
}
