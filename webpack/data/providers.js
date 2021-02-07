// Calls the JSON feed to pull down providers data
async function fetchProviders() {
  const siteURL = "https://api.vaccinateca.com/v1/providers.json";
  const response = await fetch(siteURL);

  if (!response.ok) {
    alert("Could not retrieve the provider data.");
    return;
  }

  return (await response.json())["content"];
}

function getProviderName(p) {
  return p["Provider"];
}

function findProviderByName(providers, name) {
  return providers.find((p) => p["Provider"] === name);
}

export {
  fetchProviders,
  findProviderByName,
  getProviderName
};
