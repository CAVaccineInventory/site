import {
  fetchSites,
  splitSitesByVaccineState,
  sortByRecency,
  getCounty,
} from "./data/locations.js";

import { addSitesOrHideIfEmpty } from "./sites.js";
import { fetchCounties } from "./data/counties.js";
import policyTemplate from "./templates/policy.handlebars";
import marked from "marked";
import sanitizeHtml from "sanitize-html";

window.addEventListener("load", fetchCountySites);
window.addEventListener("load", fetchCountyCard);

function currentCounty() {
  return document.getElementById("js-county-name").textContent.trim();
}

async function fetchCountySites() {
  let sites = await fetchSites();
  const county = currentCounty();

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

  addSitesOrHideIfEmpty(sitesWithVaccine, "js-sites-with-vaccine");
  addSitesOrHideIfEmpty(sitesWithoutVaccine, "js-sites-without-vaccine");
  addSitesOrHideIfEmpty(sitesWithNoReport, "sitesWithoutReport");
}

async function fetchCountyCard() {
  const countyPolicies = await fetchCounties();
  const countyPolicy = countyPolicies.find(
    (county) => county["County"].replace(" County", "") === currentCounty()
  );

  let notes = countyPolicy["Notes"];
  if (notes) {
    notes = sanitizeHtml(marked(notes));
  }

  const templateInfo = {
    name: countyPolicy["County"],
    infoURL: countyPolicy["Vaccine info URL"],
    locationsURL: countyPolicy["Vaccine locations URL"],
    volunteering: countyPolicy["Official volunteering opportunities"],
    reservationURL: countyPolicy["countyPolicy vaccination reservations URL"],
    facebook: countyPolicy["Facebook Page"],
    twitter: countyPolicy["Twitter Page"],
    notes: notes,
  };

  document.querySelector(".js-county-policy").innerHTML = policyTemplate(
    templateInfo
  );
}
