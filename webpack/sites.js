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
  const siteTemplate = document.getElementById("site_location_template")
    .content;

  for (const site of sites.slice(0, 50)) {
    const info = getDisplayableVaccineInfo(site);
    const siteRootElem = siteTemplate.cloneNode(true);
    siteRootElem.querySelector(".site_title").textContent = info.name;

    let addressElemCounter = 0;
    if (info.county) {
      const countyElem = siteRootElem.querySelector(".site_county");
      if (countyElem) {
        countyElem.innerHTML = info.county;
        countyElem.href = generateCountyUrl(info.county);
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
        vaccineStateElem.classList.add(
          `vaccine_${info.hasVaccine.toLowerCase()}`
        );
      }
      const ageElem = siteRootElem.querySelector(".site_age_restriction");
      const otherRestrictionsElem = siteRootElem.querySelector(
        ".site_other_restrictions"
      );
      const appointmentElem = siteRootElem.querySelector(
        ".site_appointment_required"
      );

      if (info.hasVaccine === "Yes") {
        if (info.ageRestriction) {
          if (ageElem) {
            ageElem.innerHTML = `${info.ageRestriction} ${window.messageCatalog.nearest_js_years_up}`;
          }
        }

        if (otherRestrictionsElem) {
          let content = "";
          if (info.isLimitedToPatients) {
            content = window.messageCatalog.nearest_js_patients_only;
          } else if (info.isCountyRestricted) {
            content = window.messageCatalog.nearest_js_county_only;
          }
          otherRestrictionsElem.innerHTML = content;
        }

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
      } else {
        ageElem.remove();
        otherRestrictionsElem.remove();
        appointmentElem.remove();
        const divider = siteRootElem.querySelector(".mobile_divider");
        if (divider) {
          divider.remove();
        }
      }

      const latestInfoElem = siteRootElem.querySelector(".site_latest_info");

      if (latestInfoElem) {
        const notes = flattenData(info.reportNotes);
        if (notes) {
          const contentElem = latestInfoElem.querySelector(
            ".site_latest_info_details"
          );
          contentElem.innerHTML = urlify(notes);
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

    fragmentElem.appendChild(siteRootElem);
  }
  const containerElem = document.getElementById(containerId);
  const loading = containerElem.querySelector(".loading");
  if (loading) {
    loading.remove();
  }
  containerElem.appendChild(fragmentElem);
}

export { addSitesToPage };
