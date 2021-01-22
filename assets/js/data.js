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

async function fetchZipCodesData() {
  const res = await fetch("assets/json/zipCodes.json");
  if (res.ok) {
    return await res.json();
  }
  return null;
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

function getCounty(p) {
  return p["County"];
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
    return p["Location Type"] === "Super Site";
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
    county: p["County"],
    isSuperSite: isSuperSite(p),
    latestReportDate: p["Latest report"],
  };
}

function getTimeDiffFromNow(timestamp) {
  const unixTime = new Date(timestamp).getTime();
  if (!unixTime) return;
  const now = new Date().getTime();
  const delta = Math.abs(unixTime / 1000 - now / 1000);
  var timeUnitValue = "unit_value",
    timeUnitName = "unit_name";

  if (delta / (60 * 60 * 24 * 365) > 1) {
    timeUnitValue = Math.floor(delta / (60 * 60 * 24 * 365));
    timeUnitName = pluralizeTimeUnit(timeUnitValue, "year");
  } else if (delta / (60 * 60 * 24 * 45) > 1) {
    timeUnitValue = Math.floor(delta / (60 * 60 * 24 * 45));
    timeUnitName = pluralizeTimeUnit(timeUnitValue, "month");
  } else if (delta / (60 * 60 * 24) > 1) {
    timeUnitValue = Math.floor(delta / (60 * 60 * 24));
    timeUnitName = pluralizeTimeUnit(timeUnitValue, "day");
  } else if (delta / (60 * 60) > 1) {
    timeUnitValue = Math.floor(delta / (60 * 60));
    timeUnitName = pluralizeTimeUnit(timeUnitValue, "hour");
  } else {
    timeUnitValue = Math.floor(delta);
    timeUnitName = pluralizeTimeUnit(timeUnitValue, "second");
  }

  return `${timeUnitValue} ${timeUnitName} ago`;
}

function pluralizeTimeUnit(value, timeUnitName) {
  return value > 1 ? `${timeUnitName}s` : timeUnitName;
}

export {
  fetchSites,
  getHasVaccine,
  getDisplayableVaccineInfo,
  getHasReport,
  getCoord,
  getCounty,
  getTimeDiffFromNow,
  fetchZipCodesData,
};
