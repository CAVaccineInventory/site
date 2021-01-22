import { fetchSites, getHasVaccine, getCounty } from "./data.js";

import { addSitesToPage } from "./sites.js";

window.addEventListener("load", fetchRegionSites);

async function fetchRegionSites() {
  console.log("fetching...");
  let sites = await fetchSites();
  const counties = document
    .getElementById("counties_list")
    .textContent.trim()
    .split(",")
    .map((c) => c.trim());

  const sitesByCounty = {};
  for (const county of counties) {
    sitesByCounty[county] = sites.filter((site) => {
      return [county, county + " County"].includes(getCounty(site));
    });
  }

  for (const county in sitesByCounty) {
    // Make 2 copies of region_county_list_template, one for yes and one for no
    const regionYesTemplate = document
      .getElementById("region_county_list_template")
      .content.cloneNode(true);
    const regionNoTemplate = document
      .getElementById("region_county_list_template")
      .content.cloneNode(true);
    regionYesTemplate
      .querySelector(".sites")
      .setAttribute("id", `${county}WithVaccine`);
    regionNoTemplate
      .querySelector(".sites")
      .setAttribute("id", `${county}WithoutVaccine`);
    regionYesTemplate.querySelector(".county_name").innerText = county;
    regionNoTemplate.querySelector(".county_name").innerText = county;
    document.getElementById("withVaccine").appendChild(regionYesTemplate);
    document.getElementById("withoutVaccine").appendChild(regionNoTemplate);

    // Populate sites into both region lists
    let sitesWithVaccine = [];
    let sitesWithoutVaccine = [];

    for (const site of sitesByCounty[county]) {
      if (getHasVaccine(site)) {
        sitesWithVaccine.push(site);
      } else {
        sitesWithoutVaccine.push(site);
      }
    }

    addSitesToPage(sitesWithVaccine, `${county}WithVaccine`);
    addSitesToPage(sitesWithoutVaccine, `${county}WithoutVaccine`);
  }
}
