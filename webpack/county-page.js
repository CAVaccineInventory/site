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
import { t } from "./i18n.js";

window.addEventListener("load", fetchCountySites);
window.addEventListener("load", fetchCountyCard);

function currentCounty() {
  return document.getElementById("js-county-policy").dataset.county;
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
  addSitesOrHideIfEmpty(sitesWithNoReport, "js-sites-without-report");
}

async function fetchCountyCard() {
  const countyPolicies = await fetchCounties();
  const countyPolicy = countyPolicies.find(
    (county) =>
      county["County"].replace(" County", "").trim() === currentCounty()
  );
  if (!countyPolicy) {
    Sentry.captureMessage(`Couldn't find county for ${currentCounty()}`);
    return;
  }

  let notes = countyPolicy["Notes"];
  if (notes) {
    notes = sanitizeHtml(marked(notes));
  }

  const templateInfo = {
    name: countyPolicy["County"],
    infoURL: countyPolicy["Vaccine info URL"],
    infoLabel: t("policy.vaccine_info"),
    locationsURL: countyPolicy["Vaccine locations URL"],
    locationsLabel: t("policy.vaccine_locations"),
    volunteering: countyPolicy["Official volunteering opportunities"],
    volunteeringLabel: t("policy.volunteer_opportunities"),
    reservationURL: countyPolicy["countyPolicy vaccination reservations URL"],
    reservationLabel: t("policy.vaccine_appointments"),
    facebook: countyPolicy["Facebook Page"],
    twitter: countyPolicy["Twitter Page"],
    notes: notes,
    latestInfo: t("global.latest_info"),
  };

  document.getElementById("js-county-policy").innerHTML = policyTemplate(
    templateInfo
  );
}
