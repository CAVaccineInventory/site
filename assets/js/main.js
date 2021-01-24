"use strict";

import counties from "./counties.js";

var airtableBaseUrl;

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

  // This is a global function for sending detailed analytics.
  // https://developers.google.com/analytics/devguides/collection/gtagjs/events
  window.sendAnalyticsEvent = function (action, category, label, value) {
    if (typeof gtag != "undefined") {
      gtag("event", action, {
        event_category: category,
        event_label: label,
        value: value,
      });
    }
  };
};
