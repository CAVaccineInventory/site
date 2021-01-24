import { getMessageCatalog } from './message-catalog.js'
// Calls the JSON feed to pull down sites data
async function fetchSites() {
  const siteURL =
    "https://storage.googleapis.com/cavaccineinventory-sitedata/airtable-sync/Locations.json";
  let response = await fetch(siteURL);

  if (!response.ok) {
    alert(getMessageCatalog()['data_js_alert']);
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
  if (
    p["Location Type"] === "Test Location" ||
    !p.hasOwnProperty("Has Report")
  ) {
    return false;
  }
  return p["Has Report"];
}

function getCoord(p) {
  return { latitude: p["Latitude"], longitude: p["Longitude"] };
}

function getCounty(p) {
  return p["County"];
}

function getDisplayableVaccineInfo(p) {
  function getVaccineStatus(p) {
    const info = p["Availability Info"];
    if (!Array.isArray(info)) return false;
    return info
      .map((info) =>
        info
          .replace("Yes: ", "")
          .replace("No: ", "")
          .replace(
            "Skip: call back later",
            getMessageCatalog()['data_js_call_back']
          )
      )
      .join(" | ");
  }
  function getSchedulingInstructions(p) {
    const instructions = p["Appointment scheduling instructions"];
    if (!Array.isArray(instructions)) {
      return null;
    }
    return replaceAnyLinks(instructions.join(", "));
  }
  function getRepNotes(p) {
    const notes = p["Latest report notes"];
    if (!Array.isArray(notes)) {
      return null;
    }
    const linkifiedNotes = replaceAnyLinks(notes.join(" | "));
    if (linkifiedNotes.trim() === "") {
      return null;
    }
    return notes;
  }

  function replaceAnyLinks(body) {
    // Regex from https://stackoverflow.com/a/3890175.
    const urlRegex = /(\b(https?|ftp):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gi;
    if (!body) {
      return "";
    }
    return body.replace(urlRegex, "<a href='$1' target='_blank'>$1</a>");
  }

  const hasReport = getHasReport(p);

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
