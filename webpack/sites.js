import {
  getDisplayableVaccineInfo,
  getTimeDiffFromNow,
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
    };

    const range = document
      .createRange()
      .createContextualFragment(siteTemplate(context));
    initCopyButton(range.querySelector(".site_copy_button"), info);
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
  if (info.educationWorkers) {
    restrictions.push(t("site_template.education_workers"));
  }
  if (info.foodWorkers) {
    restrictions.push(t("site_template.food_workers"));
  }
  if (info.emergencyWorkers) {
    restrictions.push(t("site_template.emergency_workers"));
  }
  if (info.highRisk) {
    const url =
      "https://www.cdph.ca.gov/Programs/CID/DCDC/Pages/COVID-19/vaccine-high-risk-factsheet.aspx";
    const link = plainText
      ? `${t("site_template.high_risk_individuals")} (${url})`
      : `<a target="_blank" href=${url}>${t(
        "site_template.high_risk_individuals"
      )}</a>`;
    restrictions.push(link);
  }

  if (info.determinedByProvider) {
    // if we already display URL in provider notes, don't repeat here
    if (!info.providerNotes || !info.providerNotes.includes(info.providerURL)) {
      const link = plainText
        ? `${t("site_template.eligibility_by_provider")} (${info.providerURL})`
        : `<a target="_blank" href=${info.providerURL}>${t(
          "site_template.eligibility_by_provider"
        )}</a>`;
      restrictions.push(link);
    }
  }

  if (info.determinedByCounty) {
    const urlPath = generateCountyUrl(info.county);
    const link = plainText
      ? `${t(
        "site_template.eligibility_by_county"
      )} (https://vaccinateca.com/${urlPath})`
      : `<a target="_blank" href=${urlPath}>${t(
        "site_template.eligibility_by_county"
      )}</a>`;
    restrictions.push(link);
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
    const latestReportTime = generateLatestReportTime(info);
    let reportInfo = "";
    if (info.hasReport) {
      switch (info.hasVaccine) {
        case "Yes":
          reportInfo = t("nearest.vaccines_available");
          break;
        case "No":
          reportInfo = t("nearest.vaccines_not_available");
          break;
        default:
          reportInfo = t("nearest.vaccine_unknown");
          break;
      }
      reportInfo += ` (${latestReportTime})\n`;
    }

    let appointmentInfo = "";
    if (info.vaccineSpotterExists) {
      appointmentInfo = info.vaccineSpotterAppointmentAvailability
        ? `Appointments are available as of ${info.vaccineSpotterUpdatedAt}`
        : `Appointments are not available as of ${info.vaccineSpotterUpdatedAt}`;
      appointmentInfo += ` (${info.vaccineSpotterURL})\n`;
    } else if (info.isAppointmentRequired) {
      appointmentInfo = `${generateAppointmentRequiredLabel(info)}`;
      appointmentInfo += info.schedulingInstructionsPlainText
        ? ` (${info.schedulingInstructionsPlainText})\n`
        : "\n";
    }

    const restrictions = generateRestrictions(info, true);
    const restrictionsInfo =
      restrictions.length > 0
        ? `${t("site_template.vaccinating")}:\n` + restrictions.join("\n")
        : "";

    const copyString =
      `${info.name} ${info.address}\n` +
      reportInfo +
      appointmentInfo +
      restrictionsInfo;
    await navigator.clipboard.writeText(copyString);

    copyButton.textContent = t("site_template.copied_text");
    copyButton.classList.remove("not_copied");
    copyButton.classList.add("copied");
    copyButton.blur();
    if (lastInteractedCopyButton && lastInteractedCopyButton !== copyButton) {
      lastInteractedCopyButton.textContent = t("site_template.copy_text");
      lastInteractedCopyButton.classList.remove("copied");
      lastInteractedCopyButton.classList.add("not_copied");
    }
    lastInteractedCopyButton = copyButton;
  });
}

export { addSitesToPage, addSitesOrHideIfEmpty };
