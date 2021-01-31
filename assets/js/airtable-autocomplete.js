import counties from "./counties.js";

let airtableBaseUrl;

window.addEventListener("DOMContentLoaded", updateFilterFromUrlFragment);
window.addEventListener("hashchange", updateFilterFromUrlFragment);

function updateFilterFromUrlFragment() {
  const airtable = document.querySelector(".airtable-embed");
  if (airtable && airtableBaseUrl === undefined) {
    airtableBaseUrl = airtable.src;
  }
  if (window.location.hash.length > 1) {
    const countyName = window.location.hash.substring(1).replace(/_/g, " ");
    const input = document.querySelector("#autoComplete");
    if (counties.indexOf(countyName) == -1) {
      return;
    }
    if (input) {
      input.value = countyName;
    }
    if (airtable) {
      airtable.src = airtableBaseUrl + "&filter_County=" + countyName;
    }
  }
}

window.addEventListener("load", () => {
  const input = document.querySelector("#autoComplete");
  if (input) {
    const airtable = document.querySelector(".airtable-embed");
    const countiesAutocompleteSource = input
      .getAttribute("data-collection")
      .split(",")
      .map(
        (c) =>
          `${c.replace(/^\s*(.*\S)\s*$/, "$1")}${
            c.includes("San Francisco") ? "" : " County"
          }`
      );
    new autoComplete({
      data: {
        src: countiesAutocompleteSource,
      },
      selector: "#autoComplete",
      maxResults: 7,
      highlight: true,
      onSelection: (feedback) => {
        const selected = feedback.selection.value;
        input.value = selected;
        if (airtableBaseUrl === undefined) {
          // This should never happen because DOMContentLoaded should always fire
          // first. But if it does happen, then the current airtable src should
          // have no extra filters in it from the DOMContentLoaded handler, so
          // we can just read that.
          airtableBaseUrl = airtable.src;
        }
        airtable.src = airtableBaseUrl + "&filter_County=" + selected;
        window.location.hash = selected.replace(/ /g, "_");
      },
    });

    // If a user clears the search field and hits enter, reset to unfiltered table
    input.addEventListener("keydown", (e) => {
      if (e.key == "Enter" && input.value.length == 0) {
        airtable.src = airtableBaseUrl;
        window.location.hash = "";
      }
    });
  }
});
