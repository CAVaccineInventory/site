import { fetchSites, getHasVaccine, getCounty } from "./data.js";

import { addSitesToPage } from "./sites.js";

window.addEventListener("load", fetchCountySites);

async function fetchCountySites() {
  console.log("fetching...");
  let sites = await fetchSites();
  let county = document.getElementById("county_name").textContent.trim();

  // Filter by this page's county.
  sites = sites.filter((site) => {
    return [county, county + " County"].includes(getCounty(site));
  });

  let sitesWithVaccine = [];
  let sitesWithoutVaccine = [];

  sites.forEach(function (site) {
    if (getHasVaccine(site)) {
      sitesWithVaccine.push(site);
    } else {
      sitesWithoutVaccine.push(site);
    }
  });

  addSitesToPage(sitesWithVaccine, "sitesWithVaccine");
  addSitesToPage(sitesWithoutVaccine, "sitesWithoutVaccine");
}
