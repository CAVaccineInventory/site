// Calls the JSON feed to pull down counties data
async function fetchCounties() {
  const siteURL = "https://api.vaccinateca.com/v1/counties.json";
  const response = await fetch(siteURL);

  if (!response.ok) {
    alert("Could not retrieve the county data.");
    return;
  }

  const json = await response.json();
  return json["content"].filter((county) => county["County"]);
}

export { fetchCounties };
