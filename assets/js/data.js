// Calls the JSON feed to pull down sites data
async function fetchSites() {
  const siteURL =
    "https://storage.googleapis.com/cavaccineinventory-sitedata/airtable-sync/Locations.json";
  let response = await fetch(siteURL);

  if (!response.ok) {
    alert("Could not retrieve the vaccination site data.");
    return;
  }
  return response.json();
}

// Utilities for working with the JSON feed
function getHasVaccine(p) {
  try {
    return (
      p["Latest report yes?"] == 1 && p["Location Type"] != "Test Location"
    );
  } catch {
    return false;
  }
}

function getHasReport(p) {
  try {
    if (p["Location Type"] != "Test Location") {
      return p["Has Report"];
    } else {
      return false;
    }
  } catch {
    return false;
  }
}

function getCoord(p) {
  return { latitude: p["Latitude"], longitude: p["Longitude"] };
}

function getDisplayableVaccineInfo(p) {
  function getVaccineStatus(p) {
    try {
      return p["Availability Info"]
        .map((info) =>
          info
            .replace("Yes: ", "")
            .replace("No: ", "")
            .replace(
              "Skip: call back later",
              "Could not reach human, calling back later"
            )
        )
        .join(" | ");
    } catch {
      return null;
    }
  }
  function getSchedulingInstructions(p) {
    try {
      return replaceAnyLinks(
        p["Appointment scheduling instructions"].join(", ")
      );
    } catch {
      return null;
    }
  }
  function getRepNotes(p) {
    try {
      let notes = replaceAnyLinks(p["Latest report notes"].join(" | "));
      if (notes == " ") {
        return null;
      }
      return notes;
    } catch {
      return null;
    }
  }

  function replaceAnyLinks(body) {
    let url_regex = /((http|https|ftp):\/\/[\w?=&.\/-;#~%-]+(?![\w\s?&.\/;#~%"=-]*>))/g;
    if (body) {
      return body.replace(url_regex, "<a href='$1' target='_blank'>$1</a>");
    }
  }

  let hasReport = getHasReport(p);
  function getYesNo(p) {
    if (hasReport) {
      return getHasVaccine(p) ? "Yes" : "No";
    } else {
      return "Unknown";
    }
  }

  function isSuperSite(p) {
    return (
      p["Location Type"] === "Super Site" || p["Location Type"] === "Megasite"
    );
  }

  return {
    status: getVaccineStatus(p),
    hasReport: hasReport,
    name: p["Name"],
    schedulingInstructions: getSchedulingInstructions(p),
    address: p["Address"] || null,
    reportNotes: getRepNotes(p),
    longitude: p["Longitude"],
    latitude: p["Latitude"],
    address: p["Address"],
    isSuperSite: isSuperSite(p),
  };
}

export {
  fetchSites,
  getHasVaccine,
  getDisplayableVaccineInfo,
  getHasReport,
  getCoord,
};
