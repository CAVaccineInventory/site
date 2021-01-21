import {
  fetchSites,
  getDisplayableVaccineInfo,
  getHasVaccine,
  getHasReport,
  getCounty,
  getCoord,
} from "./data.js";

// Capitalizes the first letter of a word.
String.prototype.capitalize = function() {
  return this.charAt(0).toUpperCase() + this.slice(1)
}

function getCountyFromPageURL(){
	// Parses https://vaccinateca.com/counties/san_mateo and pulls out 'san_mateo'
	// Converts to capitalized and spaced form, i.e. 'San Mateo'
	let countyFromPath = window.location.pathname.split("/")[2]
	let countyParts = countyFromPath.split("_").map(function(w) {return w.capitalize() })
	return countyParts.join(" ")
}

async function fetchCountySites() {
  console.log("fetching...");
  let sites = await fetchSites();
  let county = getCountyFromPageURL();

  // Filter by this page's county.
  sites = sites.filter((site) => {
  	return ([county, county + " County"].includes(getCounty(site)));
  });

  let sitesWithVaccine = [];
  let sitesWithoutVaccine = [];

  sites.forEach(function(site) {
  	if (getHasVaccine(site)){
  		sitesWithVaccine.push(site);
  	}
  	else { 
  		sitesWithoutVaccine.push(site);
  	}
  });

  // return {
  // 	sitesWithVaccine: sitesWithVaccine,
  // 	sitesWithoutVaccine: sitesWithoutVaccine
  // }

  addSitesToPage(sitesWithVaccine, "sitesWithVaccine");
  addSitesToPage(sitesWithoutVaccine, "sitesWithoutVaccine");
}

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

fetchCountySites();