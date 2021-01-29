// Calls the JSON feed to pull down counties data
async function fetchCounties() {
  const siteURL =
    "https://storage.googleapis.com/cavaccineinventory-sitedata/airtable-sync/Counties.json";
  let response = await fetch(siteURL);

  if (!response.ok) {
    alert("Could not retrieve the vaccination site data.");
    return;
  }
  return response.json();
}

export {
  fetchCounties
};