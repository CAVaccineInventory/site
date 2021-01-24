import { getDisplayableVaccineInfo, getTimeDiffFromNow } from "./data.js";

function createDetailRow(reportElem, title, content) {
  const elem = document
    .getElementById("report_detail_template")
    .content.cloneNode(true);
  elem.querySelector(".detail_title").textContent = title;
  elem.querySelector(".detail_content").innerHTML = content;
  reportElem.appendChild(elem);
}

function addSitesToPage(sites, container, userCounty) {
  const list = document.getElementById(container);
  const site_template = document.getElementById("site_location_template")
    .content;

  for (const site of sites.slice(0, 50)) {
    let info = getDisplayableVaccineInfo(site);
    const siteRootElem = site_template.cloneNode(true);
    siteRootElem.querySelector(".site_title").textContent = info.name;

    // Some sites don't have addresses.
    const addressElem = siteRootElem.querySelector(".site_address");
    if (info.address || info.county) {
      const linkElem = addressElem.querySelector("a");
      if (linkElem) {
        const address = [info.county, info.address].filter(Boolean).join(" - ");
        linkElem.textContent = address;
        linkElem.href = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
          info.address || info.county
        )}`;
      }
    } else {
      addressElem.remove();
    }

    const reportElem = siteRootElem.querySelector(".site_report");
    const noReportElem = siteRootElem.querySelector(".site_no_report");

    if (
      userCounty &&
      info.county &&
      info.county.toLowerCase().includes(userCounty.toLowerCase())
    ) {
      const countyMatchElem = siteRootElem.querySelector(".site_in_county");
      if (countyMatchElem) {
        countyMatchElem.classList.remove("hidden");
      }
    }
    // Show whatever report we have
    if (info.hasReport) {
      noReportElem.remove();

      createDetailRow(
        reportElem,
        window.messageCatalog["global_details"],
        info.status
      );

      if (info.schedulingInstructions) {
        createDetailRow(
          reportElem,
          window.messageCatalog["global_appt_info"],
          info.schedulingInstructions
        );
      }
      if (info.locationNotes) {
        createDetailRow(
          reportElem,
          window.messageCatalog["global_location_notes"],
          info.locationNotes
        );
      }
      if (info.reportNotes) {
        createDetailRow(
          reportElem,
          window.messageCatalog["global_latest_info"],
          info.reportNotes
        );
      }
      if (info.latestReportDate) {
        const latestReportElem = siteRootElem.querySelector(
          ".site_last_report_date"
        );
        try {
          const timeDiff = getTimeDiffFromNow(info.latestReportDate);
          latestReportElem.textContent = `${window.messageCatalog["global_latest_report"]
            }: ${timeDiff}`;
        } catch (e) {
          console.error(e);
        }
      }
    } else {
      reportElem.remove();
    }

    list.appendChild(siteRootElem);
  }
}

export { addSitesToPage };
