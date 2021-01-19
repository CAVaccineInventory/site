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
        .map((info) => info.replace("Yes: ", "").replace("No: ", ""))
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
  };
}

export { getHasVaccine, getDisplayableVaccineInfo, getHasReport, getCoord };
