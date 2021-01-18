"use strict";

import counties from "./counties.js";

window.onload = () => {
  document.querySelector(".nav-button").addEventListener("click", (e) => {
    document.querySelector("nav").classList.toggle("is_open");
    e.preventDefault();
  });

  const input = document.querySelector("#autoComplete");
  if (input) {
    const airtable = document.querySelector(".airtable-embed");
    const airtableURL = airtable.src;

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
        airtable.src = airtableURL + "&filter_County=" + selected;
      },
    });

    // If a user clears the search field and hits enter, reset to unfiltered table
    input.addEventListener("keydown", (e) => {
      if (e.key == "Enter" && input.value.length == 0) {
        airtable.src = airtableURL;
      }
    });
  }
};
