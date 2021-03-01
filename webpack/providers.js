import { fetchProviders } from "./data/providers.js";
import providerTemplate from "./templates/provider.handlebars";
import { markdownify } from "./markdown.js";

window.addEventListener("load", loadProviders);

async function loadProviders() {
  const providers = await fetchProviders();
  const providerList = document.getElementById("js-providers");
  const labels = JSON.parse(
    document.getElementById("js-provider-labels").textContent
  );

  for (const provider of providers) {
    let notes = provider["Public Notes"];
    if (notes) {
      notes = markdownify(notes);
    }

    const templateInfo = {
      name: provider["Provider"],
      type: provider["Provider network type"],
      infoURL: provider["Vaccine info URL"],
      infoLabel: labels["info"],
      locationURL: provider["Vaccine locations URL"],
      locationLabel: labels.locations,
      appointmentURL: provider["Appointments URL"],
      appointmentLabel: labels.appointments,
      notes: notes,
    };

    providerList.innerHTML += providerTemplate(templateInfo);
  }
}
