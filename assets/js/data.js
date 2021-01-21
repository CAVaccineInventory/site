function setWithExpiry(key, value, ttl) {
  const now = new Date();

  // `item` is an object which contains the original value
  // as well as the time when it's supposed to expire
  const item = {
    value: value,
    expiry: now.getTime() + ttl,
  };
  localStorage.setItem(key, JSON.stringify(item));
}

function getWithExpiry(key) {
  const itemStr = localStorage.getItem(key);
  // if the item doesn't exist, return null
  if (!itemStr) {
    return null;
  }
  const item = JSON.parse(itemStr);
  const now = new Date();
  // compare the expiry time of the item with the current time
  if (now.getTime() > item.expiry) {
    // If the item is expired, delete the item from storage
    // and return null
    localStorage.removeItem(key);
    return null;
  }
  return item.value;
}

// Calls the JSON feed to pull down sites data
async function fetchSites() {
  const cachedSites = getWithExpiry("sites");
  if (cachedSites) {
    return cachedSites;
  }
  const siteURL =
    "https://storage.googleapis.com/cavaccineinventory-sitedata/airtable-sync/Locations.json";
  let response = await fetch(siteURL);

  if (!response.ok) {
    alert("Could not retrieve the vaccination site data.");
    return;
  }
  const sites = await response.json();
  setWithExpiry("sites", sites, 1000 * 60 * 10); // Cache for 10 minutes
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
  };
}

export {
  fetchSites,
  getHasVaccine,
  getDisplayableVaccineInfo,
  getHasReport,
  getCoord,
};
