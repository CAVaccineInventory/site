import {
  getDisplayableVaccineInfo,
  getTimeDiffFromNow,
} from "./data/locations.js";

function beautifyLinks(contentElem) {
  const linksElem = contentElem.querySelectorAll("a");
  for (const linkElem of linksElem) {
    linkElem.textContent = shorten(linkElem.textContent, 40);
    linkElem.classList.add("text-black");
    linkElem.setAttribute("target", "_blank");
    linkElem.setAttribute("rel", "noreferrer");
    linkElem.textContent;
  }
}

function urlify(text) {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  return text.replace(urlRegex, function (url) {
    return '<a href="' + url + '">' + url + "</a>";
  });
}

function flattenData(strOrStrArray) {
  return Array.isArray(strOrStrArray)
    ? strOrStrArray.join("; ")
    : strOrStrArray;
}

function generateCountyUrl(countyName) {
  return `/counties/${countyName.replace(" County", "").replace(" ", "_")}`;
}

function shorten(text, maxLen) {
  return text.length > maxLen ? `${text.slice(0, maxLen)}...` : text;
}

function addSitesToPage(sites, containerId, userCounty) {
  const fragmentElem = document.createDocumentFragment();
  fragmentElem.innerHTML = "";
  const templateSource = document.querySelector("#siteLocationTemplate").innerHTML;
  const siteTemplate = Handlebars.compile(templateSource);

  for (const site of sites.slice(0, 50)) {
    const info = getDisplayableVaccineInfo(site);

    const addressLink = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
      info.address
    )}`;

    let otherRestrictions = window.messageCatalog.nearest_js_patients_only;
    if (info.isCountyRestricted) {
      otherRestrictions = window.messageCatalog.nearest_js_county_only;
    }

    const latestReportTime = `${window.messageCatalog["global_latest_report"]} ${getTimeDiffFromNow(info.latestReportDate)}`;

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
      ageRestriction: `${info.ageRestriction} ${window.messageCatalog.nearest_js_years_up}`,
      otherRestrictions: otherRestrictions,
      appointmentRequired: info.isAppointmentRequired,
      appointmentInstructions: info.schedulingInstructions,
      notes: urlify(flattenData(info.reportNotes)),
    };

    // if (info.hasReport) {
    //   const vaccineStateElem = siteRootElem.querySelector(
    //     ".site_vaccine_status"
    //   );
    //   if (vaccineStateElem) {
    //     vaccineStateElem.classList.add(
    //       `vaccine_${info.hasVaccine.toLowerCase()}`
    //     );
    //   }
    // }

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
