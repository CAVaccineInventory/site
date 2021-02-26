import { fetchProviders } from "./data/providers.js";
import providerTemplate from "./templates/provider.handlebars";
import { markdownify } from "./markdown.js";

window.addEventListener("load", loadProviders);

async function loadProviders() {
  const providers = await fetchProviders();
  const providerList = document.getElementById("js-providers");

  for (const provider of providers) {
    let notes = provider["Public Notes"];
    if (notes) {
      notes = markdownify(notes);
    }

    const templateInfo = {
      name: provider["Provider"],
      type: provider["Provider network type"],
      infoURL: provider["Vaccine info URL"],
      locationURL: provider["Vaccine locations URL"],
      appointmentURL: provider["Appointments URL"],
      notes: notes,
    };

    providerList.innerHTML += providerTemplate(templateInfo);
  }
}
