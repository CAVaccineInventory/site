"use strict";

import counties from "./counties.js";

var airtableBaseUrl;

document.addEventListener("DOMContentLoaded", () => {
  const airtable = document.querySelector(".airtable-embed");
  if (airtable) {
    airtableBaseUrl = airtable.src;
  }
  if (window.location.hash.length > 1) {
    const countyName = window.location.hash.substring(1).replaceAll("_", " ");
    if (counties.indexOf(countyName) == -1) {
      window.location.hash = "";
    }
    const input = document.querySelector("#autoComplete");
    if (input) {
      input.value = countyName;
    }
    if (airtable) {
      airtable.src += "&filter_County=" + countyName;
    }
  }
});

window.onload = () => {
  document.querySelector(".nav-button").addEventListener("click", (e) => {
    document.querySelector("nav").classList.toggle("is_open");
    e.preventDefault();
  });

  const input = document.querySelector("#autoComplete");
  if (input) {
    const airtable = document.querySelector(".airtable-embed");

    new autoComplete({
      data: {
        src: counties,
      },
      selector: "#autoComplete",
      maxResults: 7,
      highlight: true,
      onSelection: (feedback) => {
        const selected = feedback.selection.value;
        input.value = selected;
        if (!airtableBaseUrl) {
          // This should never happen because DOMContentLoaded should always fire
          // first. But if it does happen, then the current airtable src should
          // have no extra filters in it from the DOMContentLoaded handler, so
          // we can just read that.
          airtableBaseUrl = airtable.src;
        }
        airtable.src = airtableBaseUrl + "&filter_County=" + selected;
        window.location.hash = selected.replaceAll(" ", "_");
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
};
