import { fetchCounties } from "./data/counties.js";
import policyTemplate from "./templates/policy.handlebars";

window.addEventListener("load", loaded);

async function loaded() {
  console.log("loaded");
  const counties = await fetchCounties();
  const policyList = document.querySelector(".js-policies");

  counties.sort((a, b) => {
    return a["County"].localeCompare(b["County"]);
  });

  for (const county of counties) {
    console.log(county);
    const templateInfo = {
      name: county["County"],
      infoURL: county["Vaccine info URL"],
      locationsURL: county["Vaccine locations URL"],
      volunteering: county["Official volunteering opportunities"],
      reservationURL: county["County vaccination reservations URL"],
      facebook: county["Facebook Page"],
      twitter: county["Twitter Page"],
      notes: county["Notes"],
    };

    policyList.innerHTML += policyTemplate(templateInfo);
  }
}
