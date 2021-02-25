import { fetchCounties } from "./data/counties.js";
import policyTemplate from "./templates/policy.handlebars";
import autoComplete from "@tarekraafat/autocomplete.js";
import counties from "./counties.js";
import { markdownify } from "./markdown.js";

window.addEventListener("load", loaded);

function countyToAnchor(county) {
  return county.toLowerCase().replace(/\s/g, "-");
}

function filterCounty(county) {
  const policyCards = document.querySelectorAll(".js-policy-card");
  // No county? Show 'em all
  if (!county || county === "") {
    policyCards.forEach((card) => card.classList.remove("hidden"));
  } else {
    for (const card of policyCards) {
      if (card.id === countyToAnchor(county)) {
        card.classList.remove("hidden");
      } else {
        card.classList.add("hidden");
      }
    }
  }
}

async function loaded() {
  let countyPolicies = await fetchCounties();
  const policyList = document.querySelector(".js-policies");
  const input = document.querySelector(".js-county-filter");

  new autoComplete({
    data: { src: counties },
    selector: ".js-county-filter",
    resultsList: {
      idName: "county-filter-results",
      destination: "#js-autocomplete-results-location",
    },
    query: {
      manipulate: (str) => {
        return str.trim();
      },
    },
    onSelection: (feedback) => {
      const selectedValue = feedback.selection.value;
      filterCounty(countyToAnchor(selectedValue));
      input.value = selectedValue;
    },
  });

  const clearButton = document.getElementById("js-clear-button");

  input.addEventListener("input", (e) => {
    if (input.value.length == 0) {
      clearButton.classList.add("invisible");
    } else {
      clearButton.classList.remove("invisible");
    }
  });

  clearButton.addEventListener("click", (e) => {
    filterCounty();
    input.value = "";
  });

  // If a user clears the search field and hits enter, reset to unfiltered table
  input.addEventListener("keydown", (e) => {
    if (e.key == "Enter" && input.value.length == 0) {
      filterCounty();
    }
  });

  // Filter out counties without a name
  countyPolicies = countyPolicies.filter((county) => county["County"]);
  // Sort counties alphabetically
  countyPolicies.sort((a, b) => {
    return a["County"].localeCompare(b["County"]);
  });

  const labels = JSON.parse(
    document.getElementById("js-county-policy-labels").textContent
  );

  for (const county of countyPolicies) {
    let notes = county["Notes"];
    notes = markdownify(notes);

    const templateInfo = {
      name: county["County"],
      id: countyToAnchor(county["County"]),
      infoLabel: labels["vaccineInfo"],
      infoURL: county["Vaccine info URL"],
      locationsLabel: labels["vaccineLocations"],
      locationsURL: county["Vaccine locations URL"],
      reservationLabel: labels["vaccineAppointments"],
      reservationURL: county["County vaccination reservations URL"],
      volunteeringLabel: labels["volunteerOpportunities"],
      volunteeringURL: county["Official volunteering opportunities"],
      facebook: county["Facebook Page"],
      twitter: county["Twitter Page"],
      latestInfo: labels["latestInfo"],
      notes: notes,
    };

    policyList.innerHTML += policyTemplate(templateInfo);
  }
}
