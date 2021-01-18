
// Utilities for working with the JSON feed
function getHasVaccine(p) {
    try {
        return p["Vaccines available?"][0].startsWith("Yes")
    } catch {
        return false
    }
}

function getDisplayableVaccineInfo(p) {
  function getVaccineStatus(p) {
      try {
          try {
              return p["Availability Info"].map(info => info.replace("Yes: ", "")).join(" | ")
          } catch {
              return p["Vaccines available?"].map(info => info.replace("Yes, ", "")).join(" | ")
          }
      } catch {
          return null
      }
  }
  function getSchedulingInstructions(p) {
      try {
          return p["Appointment scheduling instructions"].join(", ")
      } catch {
          return null
      }
  }
  function getRepNotes(p) {
      try {
          let notes = p["Latest report notes"].join(" | ");
          if (notes == ' ') {
            return null
          }
          return notes;
      } catch {
          return null
      }
  }
  let locationNotes = p["Location notes"] || null;
  if (locationNotes == ' ') {
    locationNotes = null;
  }

  return {
    status: getVaccineStatus(p),
    name: p["Name"],
    schedulingInstructions: getSchedulingInstructions(p),
    address: p["Address"] || null,
    locationNotes: locationNotes,
    reportNotes: getRepNotes(p),
    longitude: p["Longitude"],
    latitude: p["Latitude"],
  };
}

export {getHasVaccine, getDisplayableVaccineInfo};
