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
  const mobileMenuActivator = document.querySelector(
    ".js-mobile-menu-activator"
  );
  const mobileMenuDeactivator = document.querySelector(
    ".js-mobile-menu-deactivator"
  );
  const mobileMenu = document.querySelector(".js-mobile-menu");
  document
    .querySelector(".js-mobile-menu-button")
    .addEventListener("click", (e) => {
      mobileMenuActivator.classList.toggle("hidden");
      mobileMenuActivator.classList.toggle("block");

      mobileMenuDeactivator.classList.toggle("hidden");
      mobileMenuDeactivator.classList.toggle("block");

      mobileMenu.classList.toggle("hidden");
      mobileMenu.classList.toggle("block");
      console.log("click");

      e.preventDefault();
    });
  }
};
