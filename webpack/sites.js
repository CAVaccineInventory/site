import {
  getDisplayableVaccineInfo,
  getTimeDiffFromNow,
} from "./data/locations.js";
import siteTemplate from "./templates/siteLocation.handlebars";
import marked from "marked";
import sanitizeHtml from "sanitize-html";

function flattenData(strOrStrArray) {
  return Array.isArray(strOrStrArray)
    ? strOrStrArray.join("; ")
    : strOrStrArray;
}

function generateCountyUrl(countyName) {
  return `/counties/${countyName.replace(" County", "").replace(" ", "_")}`;
}

function addSitesToPage(sites, containerId) {
  const fragmentElem = document.createDocumentFragment();
  fragmentElem.innerHTML = "";
  const labels = JSON.parse(
    document.querySelector("#siteLocationLabels").textContent
  );

  for (const site of sites) {
    const info = getDisplayableVaccineInfo(site);

    const addressLink = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
      info.address
    )}`;

    let otherRestrictions = "";
    if (info.isLimitedToPatients) {
      otherRestrictions = window.messageCatalog.nearest_js_patients_only;
    } else if (info.isCountyRestricted) {
      otherRestrictions = window.messageCatalog.nearest_js_county_only;
    }
    const latestReportTime = `${
      window.messageCatalog["global_latest_report"]
    } ${getTimeDiffFromNow(info.latestReportDate)}`;
    let ageRestriction = "";
    if (info.ageRestriction) {
      ageRestriction = `${info.ageRestriction} ${window.messageCatalog.nearest_js_years_up}`;
    }

    let appointmentRequiredLabel = labels.apptRequired;
    if (info.isScheduleFull) {
      appointmentRequiredLabel += `; ${labels.scheduleFull}`;
    }

    let notes = info.reportNotes;
    if (notes) {
      notes = flattenData(notes);
      notes = sanitizeHtml(marked(notes));
    }

    const context = {
      name: info.name,
      county: info.county,
      countyLink: generateCountyUrl(info.county),
      address: info.address,
      addressLink: addressLink,
      hasReport: info.hasReport,
      hasVaccine: info.hasVaccine == "Yes",
      hasVaccineLabel: labels.hasVaccine,
      noVaccine: info.hasVaccine == "No",
      noVaccineLabel: labels.noVaccine,
      unknownVaccine: info.hasVaccine == "Unknown",
      unknownVaccineLabel: labels.unknownVaccine,
      lastReportTime: latestReportTime,
      ageRestriction: ageRestriction,
      otherRestrictions: otherRestrictions,
      appointmentRequired: info.isAppointmentRequired,
      appointmentRequiredLabel: appointmentRequiredLabel,
      appointmentInstructions: info.schedulingInstructions,
      latestNotesLabel: labels.latestInfo,
      notes: notes,
      noReports: labels.noReports,
    };

    fragmentElem.innerHTML += siteTemplate(context);
  }
  const containerElem = document.getElementById(containerId);
  const loading = containerElem.querySelector(".loading");
  if (loading) {
    loading.remove();
  }
  containerElem.innerHTML = fragmentElem.innerHTML;
}

export { addSitesToPage };
