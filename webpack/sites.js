import {
  getDisplayableVaccineInfo,
  getTimeDiffFromNow,
} from "./data/locations.js";
import siteTemplate from "./templates/siteLocation.handlebars";
import { markdownify } from "./markdown.js";
import { t } from "./i18n.js";

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

    const restrictions = [];
    if (info.isLimitedToPatients) {
      restrictions.push(window.messageCatalog.nearest_js_patients_only);
    } else if (info.isCountyRestricted) {
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
      restrictions.push(t("site_template.high_risk_individuals"));
    }

    const latestReportTime = `${
      window.messageCatalog["global_latest_report"]
    } ${getTimeDiffFromNow(info.latestReportDate)}`;
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
      hasVaccineLabel: t("nearest.vaccines_available"),
      noVaccine: info.hasVaccine == "No",
      noVaccineLabel: t("nearest.vaccines_not_available"),
      unknownVaccine: info.hasVaccine == "Unknown",
      unknownVaccineLabel: t("nearest.vaccine_unknown"),
      lastReportTime: latestReportTime,
      restrictions: restrictions.join("<br />"),
      appointmentRequired: info.isAppointmentRequired,
      appointmentRequiredLabel: appointmentRequiredLabel,
      appointmentInstructions: info.schedulingInstructions,
      latestNotesLabel: t("global.latest_info"),
      notes: notes,
      noReports: t("site_template.no_reports"),
      providerInfoLabel: t("site_template.provider_info"),
      providerInfo: info.providerNotes,
    };

    fragmentElem.innerHTML += siteTemplate(context);
  }
  const containerElem = document.getElementById(containerId);
  const loading = containerElem.querySelector(".js-loading");
  if (loading) {
    loading.remove();
  }
  containerElem.innerHTML = fragmentElem.innerHTML;
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

export { addSitesToPage, addSitesOrHideIfEmpty };
