// Cached promise of county data so that we don't repeat the work to fetch them
let _countiesPromise;

// Calls the JSON feed to pull down counties data
async function _fetchCounties() {
  const siteURL = "https://api.vaccinateca.com/v1/counties.json";
  const response = await fetch(siteURL);

  if (!response.ok) {
    alert("Could not retrieve the county data.");
    return;
  }

  const json = await response.json();
  return json["content"].filter((county) => county["County"]);
}

// This function returns a promise (so treat it as async!)
function fetchCounties() {
  if (!_countiesPromise) {
    _countiesPromise = _fetchCounties();
  }
  return _countiesPromise;
}

async function countyInfoByName(countyName) {
  const counties = await fetchCounties();
  return counties.find((county) => county.County == countyName);
}

function getAgeFloorWithoutRestrictions(countyInfo) {
  return countyInfo["age_floor_without_restrictions"];
}

export { fetchCounties, countyInfoByName, getAgeFloorWithoutRestrictions };
