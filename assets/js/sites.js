import {
  fetchSites,
  getDisplayableVaccineInfo,
  getHasVaccine,
  getHasReport,
  getCoord,
} from "./data.js";

function createDetailRow(reportElem, title, content) {
  const elem = document
    .getElementById("report_detail_template")
    .content.cloneNode(true);
  elem.querySelector(".detail_title").textContent = title;
  elem.querySelector(".detail_content").innerHTML = content;
  reportElem.appendChild(elem);
}

function addSitesToPage(sites, container) {
  const list = document.getElementById(container);
  const site_template = document.getElementById("site_location_template")
    .content;

  for (const site of sites.slice(0, 50)) {
    let info = getDisplayableVaccineInfo(site);
    const siteRootElem = site_template.cloneNode(true);
    siteRootElem.querySelector(".site_title").textContent = info.name;

    // Some sites don't have addresses.
    const addressElem = siteRootElem.querySelector(".site_address");
    if (info.address) {
      addressElem.textContent = info.address;
    } else {
      addressElem.remove();
    }

    const reportElem = siteRootElem.querySelector(".site_report");
    const noReportElem = siteRootElem.querySelector(".site_no_report");

    // Show whatever report we have
    if (info.hasReport) {
      noReportElem.remove();

      if (info.county) {
        createDetailRow(reportElem, "County", info.county);
      }
      createDetailRow(reportElem, "Details", info.status);

      if (info.schedulingInstructions) {
        createDetailRow(
          reportElem,
          "Appointment Information",
          info.schedulingInstructions
        );
      }
      if (info.locationNotes) {
        createDetailRow(reportElem, "Location notes", info.locationNotes);
      }
      if (info.reportNotes) {
        createDetailRow(reportElem, "Latest info", info.reportNotes);
      }
    } else {
      reportElem.remove();
    }

    list.appendChild(siteRootElem);
  }
}

export { addSitesToPage };
