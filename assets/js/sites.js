import { getDisplayableVaccineInfo, getTimeDiffFromNow } from "./data.js";

function shorten(text, maxLen) {
  return text.length > maxLen ? `${text.slice(0, maxLen)}...` : text;
}

function createDetailRow(reportElem, title, content) {
  const elem = document
    .getElementById("report_detail_template")
    .content.cloneNode(true);
  elem.querySelector(".detail_title").innerHTML = title;
  const contentElem = elem.querySelector(".detail_content");
  contentElem.innerHTML = content;
  const linksElem = contentElem.querySelectorAll("a");
  for (const linkElem of linksElem) {
    linkElem.textContent = shorten(linkElem.textContent, 40);
    linkElem.setAttribute("target", "_blank");
    linkElem.setAttribute("rel", "noreferrer");
    linkElem.textContent;
  }
  reportElem.appendChild(elem);
}

function urlify(text) {
  var urlRegex = /(https?:\/\/[^\s]+)/g;
  return text.replace(urlRegex, function (url) {
    return '<a href="' + url + '">' + url + "</a>";
  });
}

function flattenData(strOrStrArray) {
  return Array.isArray(strOrStrArray)
    ? strOrStrArray.join("; ")
    : strOrStrArray;
}

function addSitesToPage(sites, container, userCounty) {
  const list = document.getElementById(container);
  const site_template = document.getElementById("site_location_template")
    .content;

  for (const site of sites.slice(0, 50)) {
    let info = getDisplayableVaccineInfo(site);
    const siteRootElem = site_template.cloneNode(true);
    siteRootElem.querySelector(
      ".site_title"
    ).textContent = info.name.toLowerCase();

    let addressElemCounter = 0;
    if (info.county) {
      const countyElem = siteRootElem.querySelector(".site_county");
      if (countyElem) {
        countyElem.innerHTML = info.county;
        countyElem.href = ``;
        addressElemCounter++;
      }
    }

    // Some sites don't have addresses.
    if (info.address) {
      const addressElem = siteRootElem.querySelector(".site_address");
      if (addressElem) {
        addressElem.textContent = info.address.toLowerCase();
        addressElem.href = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
          info.address
        )}`;
        addressElemCounter++;
      }
    }

    if (addressElemCounter < 2) {
      siteRootElem.querySelector(".address_separator").remove();
    }

    const reportElem = siteRootElem.querySelector(".site_report");
    const noReportElem = siteRootElem.querySelector(".site_no_report");

    const latestReportElems = siteRootElem.querySelectorAll(
      ".site_last_report_date"
    );

    // Show whatever report we have
    if (info.hasReport) {
      noReportElem.remove();

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
        const notes = flattenData(info.reportNotes);
        createDetailRow(reportElem, "Latest info", urlify(notes));
      }
      if (info.latestReportDate) {
        try {
          const timeDiff = getTimeDiffFromNow(info.latestReportDate);
          latestReportElems.forEach(
            (elem) => (elem.textContent = `Updated ${timeDiff}`)
          );
        } catch (e) {
          console.error(e);
        }
      }
    } else {
      reportElem.remove();
      latestReportElems.forEach((elem) => elem.remove());
    }

    list.appendChild(siteRootElem);
  }
}

export { addSitesToPage };
