import { fetchCounties } from "./data/counties.js";
import policyTemplate from "./templates/policy.handlebars";

window.addEventListener("load", loaded);

function countyToAnchor(county) {
  return county.toLowerCase().replace(/\s/g, "-");
}

async function loaded() {
  const countyPolicies = await fetchCounties();
  const policyList = document.querySelector(".js-policies");

  countyPolicies.sort((a, b) => {
    return a["County"].localeCompare(b["County"]);
  });

  for (const county of countyPolicies) {
    console.log(county);
    const templateInfo = {
      name: county["County"],
      id: countyToAnchor(county["County"]),
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
