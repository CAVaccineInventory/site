import { fetchSites, getHasVaccine, getCounty } from "./data.js";

import { addSitesToPage } from "./sites.js";

window.addEventListener("load", fetchRegionSites);

async function fetchRegionSites() {
  console.log("fetching...");
  let sites = await fetchSites();
  const counties = document.getElementById("counties_list").textContent.trim().split(",").map((c) => c.trim());
  const county_matcher = counties.map((c) => { return [c, c + " County"] }).flat();

  sites = sites.filter((site) => {
    return county_matcher.includes(getCounty(site));
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
