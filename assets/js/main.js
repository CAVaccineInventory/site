"use strict";

import counties from "./counties.js";

var airtableBaseUrl;

window.addEventListener("DOMContentLoaded", updateFilterFromUrlFragment);
window.addEventListener("hashchange", updateFilterFromUrlFragment);

function updateFilterFromUrlFragment() {
  const airtable = document.querySelector(".airtable-embed");
  if (airtable && airtableBaseUrl === undefined) {
    airtableBaseUrl = airtable.src;
  }
  if (window.location.hash.length > 1) {
    const countyName = window.location.hash.substring(1).replaceAll("_", " ");
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

window.onload = () => {
  const mobileMenuActivator = document.querySelector(".js-mobile-menu-activator");
  const mobileMenuDeactivator = document.querySelector(".js-mobile-menu-deactivator");
  const mobileMenu = document.querySelector(".js-mobile-menu");
  document.querySelector(".js-mobile-menu-button").addEventListener("click", (e) => {

    mobileMenuActivator.classList.toggle("hidden");
    mobileMenuActivator.classList.toggle("block");

    mobileMenuDeactivator.classList.toggle("hidden");
    mobileMenuDeactivator.classList.toggle("block");

    mobileMenu.classList.toggle("hidden");
    mobileMenu.classList.toggle("block");
    console.log("click");



    e.preventDefault();
  });


  const input = document.querySelector("#autoComplete");
  if (input) {
    const airtable = document.querySelector(".airtable-embed");
    const counties_autocomplete_source = input.getAttribute('data-collection').split(',').map(c => `${c.replace(/^\s*(.*\S)\s*$/, "$1")}${ c.includes('San Francisco') ? '' : ' County'}`);
    new autoComplete({
      data: {
        src: counties_autocomplete_source,
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
