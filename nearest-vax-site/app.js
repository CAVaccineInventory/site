window.addEventListener("load", loaded);

function loaded() {
  const button = document.querySelector('#submit');
  button.addEventListener('click', submitZip);
}

function submitZip() {
  const zip = document.querySelector('#zip').value;
  if(zip.length < 5 || zip.length > 5) {
    alert("5 digit zip please");
  } else {
    lookup(zip);
  }
}

async function lookup(zip) {
  const token = "pk.eyJ1Ijoic2thbG5payIsImEiOiJja2swZXhzbXowNTEzMnBwamVndGs2NTByIn0.jh7RFylkzBpuLcIt2VpDJA"
  const geocodeURL = `https://api.mapbox.com/geocoding/v5/mapbox.places/${zip}.json?access_token=${token}`

  let response = await fetch(geocodeURL);

  if(!response.ok) {
    alert("AHHHH");
    return;
  }

  let geojson = await response.json();
  const loc = geojson.features[0].center;
  // Comes back in [long, lat]
  const coordinate = {
    longitude: loc[0],
    latitude: loc[1]
  }

  fetchAndSortSites(coordinate);
}

async function fetchAndSortSites(userCoord) {
  const siteURL = "https://storage.googleapis.com/cavaccineinventory-sitedata/airtable-sync/Locations.json"
  let response = await fetch(siteURL);

  if (!response.ok) {
    alert("sites BORK");
    return;
  }
  let sites = await response.json();

  for(const site of sites) {
    const siteCoord = {
      longitude: site.Longitude,
      latitude: site.Latitude
    }
    const distance = distanceBetweenCoordinates(userCoord, siteCoord)
    site.distance = distance;
  }

  sites.sort((a, b) => a.distance - b.distance);
  addSitesToPage(sites);
}

function addSitesToPage(sites) {
  const list = document.querySelector("#sites");
  list.innerHTML = "";
  for(const site of sites.slice(0, 50)) {
    const html = `<li>${site["Map title"]}</li>`;
    list.innerHTML += html;
  }
}

// https://github.com/skalnik/aqi-wtf/blob/main/app.js#L238-L250
function distanceBetweenCoordinates(coord1, coord2) {
  const p = Math.PI / 180;
  var a =
    0.5 -
    Math.cos((coord2.latitude - coord1.latitude) * p) / 2 +
    (Math.cos(coord1.latitude * p) *
      Math.cos(coord2.latitude * p) *
      (1 - Math.cos((coord2.longitude - coord1.longitude) * p))) /
      2;
  // 12742 is the diameter of earth in km
  return 12742 * Math.asin(Math.sqrt(a));
}
