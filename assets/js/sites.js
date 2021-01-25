import { getDisplayableVaccineInfo, getTimeDiffFromNow } from "./data.js";

function createDetailRow(reportElem, title, content) {
  const elem = document
    .getElementById("report_detail_template")
    .content.cloneNode(true);
  elem.querySelector(".detail_title").innerHTML = title;
  const contentElem = elem.querySelector(".detail_content");
  contentElem.innerHTML = content;
  beautifyLinks(contentElem);
  reportElem.appendChild(elem);
}

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
  var urlRegex = /(https?:\/\/[^\s]+)/g;
  return text.replace(urlRegex, function (url) {
    return '<a href="' + url + '">' + url + "</a>";
  });
}

function shorten(text, maxLen) {
  return text.length > maxLen ? `${text.slice(0, maxLen)}...` : text;
}

function addSitesToPage(sites, container, userCounty) {
  const list = document.getElementById(container);
  const siteTemplate = document.getElementById("site_location_template")
    .content;

  const vaccineStatusTemplates = {
    Yes: document.getElementById("vaccine_available").content,
    No: document.getElementById("vaccine_not_available").content,
    Unknown: document.getElementById("vaccine_unknown").content,
  };

  for (const site of sites.slice(0, 50)) {
    let info = getDisplayableVaccineInfo(site);
    const siteRootElem = siteTemplate.cloneNode(true);
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

      const vaccineStateElem = siteRootElem.querySelector(
        ".site_vaccine_status"
      );
      if (vaccineStateElem) {
        const template = vaccineStatusTemplates[info.hasVaccine];
        if (template) {
          vaccineStateElem.appendChild(template.cloneNode(true));
        }
      }

      if (info.ageRestriction) {
        const ageElem = siteRootElem.querySelector(".site_age_restriction");
        if (ageElem) {
          ageElem.innerHTML = `${info.ageRestriction} ${window.messageCatalog.nearest_js_years_up}`;
        }
      }

      if (info.isLimitedToPatients) {
        const patientsElem = siteRootElem.querySelector(
          ".site_limited_to_patients"
        );
        if (!patientsElem) {
          patientsElem.innerHTML = "";
        }
      }

      const appointmentElem = siteRootElem.querySelector(
        ".site_appointment_required"
      );
      if (appointmentElem) {
        if (info.isAppointmentRequired) {
          const contentElem = appointmentElem.querySelector(
            ".site_appointment_details"
          );
          contentElem.innerHTML = info.schedulingInstructions;
          beautifyLinks(contentElem);
        } else {
          appointmentElem.remove();
        }
      }

      const latestInfoElem = siteRootElem.querySelector(".site_latest_info");

      if (latestInfoElem) {
        if (info.reportNotes) {
          const contentElem = latestInfoElem.querySelector(
            ".site_latest_info_details"
          );
          contentElem.innerHTML = info.reportNotes;
          beautifyLinks(contentElem);
        } else {
          latestInfoElem.remove();
        }
      }

      if (info.latestReportDate) {
        try {
          const timeDiff = getTimeDiffFromNow(info.latestReportDate);
          latestReportElems.forEach(
            (elem) =>
              (elem.textContent = `${window.messageCatalog["global_latest_report"]} ${timeDiff}`)
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
