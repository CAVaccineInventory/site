// Calls the JSON feed to pull down providers data
async function fetchVaccineSpotterData() {
  const url = "https://www.vaccinespotter.org/api/v0/states/CA.json";
  const response = await fetch(url);

  if (!response.ok) {
    alert("Could not retrieve VaccineSpotter data");
    return null;
  }

  const payload = (await response.json())["features"];

  const vsData = {};
  payload.forEach((record) => {
    const props = record["properties"];
    if (props && props["id"]) {
      vsData[props["id"]] = record;
    }
  });

  return vsData;
}

function getVaccineSpotterStatusForLocation(vsData, location) {
  const vsRecord = vsData[location["vaccinespotter_location_id"]];

  if (vsRecord) {
    return {
      appointmentsAvailable: vsRecord["properties"]["appointments_available"],
      lastCheckedAt: vsRecord["properties"]["appointments_last_fetched"],
      url: vsRecord["properties"]["url"],
    };
  } else {
    return null;
  }
}

export { fetchVaccineSpotterData, getVaccineSpotterStatusForLocation };
