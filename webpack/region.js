import autoComplete from "@tarekraafat/autocomplete.js";
import sendAnalyticsEvent from "./sendAnalyticsEvent";
import {
  fetchSites,
  splitSitesByVaccineState,
  getCounty,
} from "./data/locations.js";
import { addSitesToPage } from "./sites.js";

window.addEventListener("load", fetchRegionSites);
window.addEventListener("load", setupFiltering);
window.addEventListener("hashchange", updateFilterFromUrlFragment);

function updateFilterFromUrlFragment() {
  const counties = getCounties();
  if (window.location.hash.length > 1) {
    const countyName = window.location.hash.substring(1).replace(/_/g, " ");
    const input = document.querySelector(".js_autocomplete");
    if (counties.indexOf(countyName) == -1) {
      return;
    }
    if (input) {
      filterCounties(input, countyName);
    }
  }
}

async function fetchRegionSites() {
  console.log("fetching...");
  const sites = await fetchSites();
  const counties = getCounties();

  const sitesByCounty = {};
  for (const county of counties) {
    sitesByCounty[county] = sites.filter((site) => {
      return [county, county + " County"].includes(getCounty(site));
    });
  }

  for (const county in sitesByCounty) {
    if (!Object.prototype.hasOwnProperty.call(sitesByCounty, county)) {
      continue;
    }

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
    regionYesTemplate.querySelector(
      ".js_county_container"
    ).dataset.county = county;
    regionNoTemplate.querySelector(
      ".js_county_container"
    ).dataset.county = county;
    regionYesTemplate.querySelector(".county_name").innerText = county;
    regionNoTemplate.querySelector(".county_name").innerText = county;

    document.getElementById("withVaccine").appendChild(regionYesTemplate);
    document.getElementById("withoutVaccine").appendChild(regionNoTemplate);

    const {
      sitesWithVaccine,
      sitesWithoutVaccine,
      sitesWithNoReport,
    } = splitSitesByVaccineState(sitesByCounty[county]);

    addSitesToPage(sitesWithVaccine, `${county}WithVaccine`);
    addSitesToPage(
      [...sitesWithoutVaccine, ...sitesWithNoReport],
      `${county}WithoutVaccine`
    );
  }

  // Once we're all loaded, update from fragment
  updateFilterFromUrlFragment();
}

function setupFiltering() {
  const input = document.querySelector(".js_autocomplete");
  if (!input) {
    return;
  }
  const counties = getCounties();

  new autoComplete({
    data: {
      src: counties,
    },
    selector: ".js_autocomplete",
    maxResults: 7,
    highlight: true,
    onSelection: (feedback) => {
      const selected = feedback.selection.value;
      filterCounties(input, selected);
    },
  });

  // If a user clears the search field and hits enter, reset to unfiltered table
  input.addEventListener("keydown", (e) => {
    if (e.key == "Enter" && input.value.length == 0) {
      document
        .querySelectorAll(".js_county_container")
        .forEach((elem) => elem.classList.remove("hidden"));
    }
    updateLocationHash(input);
  });
}

function filterCounties(input, county) {
  input.value = county;
  document
    .querySelectorAll(".js_county_container")
    .forEach((elem) => elem.classList.add("hidden"));
  document
    .querySelectorAll(`[data-county="${county}"].js_county_container`)
    .forEach((elem) => elem.classList.remove("hidden"));

  sendAnalyticsEvent("County Filter", "Vaccine Sites", "", county);
  updateLocationHash(input);
}

function updateLocationHash(input) {
  window.location.hash = input.value.replace(/ /g, "_");
}

function getCounties() {
  return document
    .getElementById("counties_list")
    .textContent.trim()
    .split(",")
    .map((c) => c.trim());
}