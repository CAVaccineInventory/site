import {
  getDisplayableVaccineInfo,
  getTimeDiffFromNow,
  siteIdInUrlOrNull,
} from "./data/locations.js";
import siteTemplate from "./templates/siteLocation.handlebars";
import { markdownify } from "./markdown.js";
import { t } from "./i18n.js";

let lastInteractedCopyButton;

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

  for (const site of sites) {
    const info = getDisplayableVaccineInfo(site);

    const addressLink = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
      info.address
    )}`;

    const restrictions = generateRestrictions(info);
    const latestReportTime = generateLatestReportTime(info);
    const appointmentRequiredLabel = generateAppointmentRequiredLabel(info);

    let notes = info.reportNotes;
    if (notes) {
      notes = flattenData(notes);
      notes = markdownify(notes);
    }

    const context = {
      id: info.id,
      name: info.name,
      county: info.county,
      countyLink: generateCountyUrl(info.county),
      address: info.address,
      addressLink: addressLink,
      hasReport: info.hasReport,
      hasVaccine: info.hasVaccine == "Yes",
      noVaccine: info.hasVaccine == "No",
      unknownVaccine: info.hasVaccine == "Unknown",
      lastReportTime: latestReportTime,
      restrictions: restrictions,
      appointmentRequired: info.isAppointmentRequired,
      appointmentRequiredLabel: appointmentRequiredLabel,
      appointmentInstructions: info.schedulingInstructions,
      appointmentInfo: info.vaccineSpotterExists,
      appointmentsAvailable: info.vaccineSpotterAppointmentAvailability,
      appointmentUpdatedAt: info.vaccineSpotterUpdatedAt,
      appointmentURL: info.vaccineSpotterURL,
      notes: notes,
      providerInfo: info.providerNotes,
      id: info.id,
    };

    const range = document
      .createRange()
      .createContextualFragment(siteTemplate(context));
    const copyButton = range.querySelector(".site_copy_button");
    if (copyButton) {
      initCopyButton(range.querySelector(".site_copy_button"), info);
    }
    fragmentElem.appendChild(range);
  }
  const containerElem = document.getElementById(containerId);
  containerElem.innerHTML = "";
  containerElem.appendChild(fragmentElem);
}

function addSitesOrHideIfEmpty(sites, containerId) {
  if (!sites.length) {
    const container = document.getElementById(containerId);
    container.parentElement.classList.add("hidden");
  } else {
    const container = document.getElementById(containerId);
    container.parentElement.classList.remove("hidden");
    addSitesToPage(sites, containerId);
  }
}

function generateAppointmentRequiredLabel(info) {
  let appointmentRequiredLabel = t("nearest.appointment_required");
  if (info.isScheduleFull) {
    appointmentRequiredLabel += `; ${t("nearest.schedule_full")}`;
  }

  if (info.isComingSoon) {
    appointmentRequiredLabel += `; ${t("nearest.coming_soon")}`;
  }

  if (info.secondDoseOnly) {
    appointmentRequiredLabel += `; ${t("nearest.second_dose_only")}`;
  }
  return appointmentRequiredLabel;
}

function generateRestrictions(info, plainText = false) {
  const restrictions = [];
    if (info.isLimitedToPatients) {
    restrictions.push(window.messageCatalog.nearest_js_patients_only);
  }
  if (info.isCountyRestricted) {
    restrictions.push(window.messageCatalog.nearest_js_county_only);
  }
  if (info.ageRestriction) {
    restrictions.push(
      `${info.ageRestriction} ${window.messageCatalog.nearest_js_years_up}`
    );
  }
  if (info.veteransOnly) {
    restrictions.push(t("site_template.veterans"));
  }

  return restrictions;
}

function generateLatestReportTime(info) {
  return `${window.messageCatalog["global_latest_report"]} ${getTimeDiffFromNow(
    info.latestReportDate
  )}`;
}

function initCopyButton(copyButton, info) {
  copyButton.addEventListener("click", async (e) => {
    // Create a new URL with the sites zip and current ID so we'll autoscroll to this site
    const url = new URL(window.location.origin);
    url.pathname = "/near-me";
    url.hash = info.id;

    const zip = info.address.slice(-5);

    if (!zip.match(/\d{5}/)) {
      Sentry.captureMessage(
        `Unable to parse zip code for site ${info.id} ${info.address}`
      );
      return;
    }
    url.searchParams.set("zip", zip);
    const copyString = url.toString();

    await navigator.clipboard.writeText(copyString);

    copyButton.textContent = t("site_template.copied_text");
    copyButton.classList.remove("not_copied");
    copyButton.classList.add("copied");
    copyButton.blur();
    if (lastInteractedCopyButton && lastInteractedCopyButton !== copyButton) {
      lastInteractedCopyButton.textContent = t("site_template.share_link");
      lastInteractedCopyButton.classList.remove("copied");
      lastInteractedCopyButton.classList.add("not_copied");
    }
    lastInteractedCopyButton = copyButton;
  });
}

/**
 * Scrolls to the site URL hash if it exists.
 * This must be called after all of the sites are added to the page.
 */
function maybeScrollToSiteInUrl() {
  const siteId = siteIdInUrlOrNull();
  if (siteId) {
    const element = document.getElementById(siteId);
    if (element) {
      element.classList.add("is-selected");
      element.scrollIntoView();
    }
  }
}

export { addSitesToPage, addSitesOrHideIfEmpty, maybeScrollToSiteInUrl };
