import { fetchProviders } from "./data/providers.js";
import providerTemplate from "./templates/provider.handlebars";

window.addEventListener("load", loadProviders);

async function loadProviders() {
  const providers = await fetchProviders();
  const providerList = document.getElementById("js-providers");

  for (const provider of providers) {
    const templateInfo = {
      name: provider["Provider"],
      type: provider["Provider network type"],
      infoURL: provider["Vaccine info URL"],
      locationURL: provider["Vaccine locations URL"],
      appointmentURL: provider["Appointments URL"],
      notes: provider["Public Notes"],
    };

    providerList.innerHTML += providerTemplate(templateInfo);
  }
}
