import { fetchProviders } from "./data/providers.js";
import providerTemplate from "./templates/provider.handlebars";
import { markdownify } from "./markdown.js";
import { t } from "./i18n.js";

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
      infoLabel: t("provider.info"),
      locationURL: provider["Vaccine locations URL"],
      locationLabel: t("provider.locations"),
      appointmentURL: provider["Appointments URL"],
      appointmentLabel: t("provider.appointments"),
      notes: notes,
    };

    providerList.innerHTML += providerTemplate(templateInfo);
  }
}
