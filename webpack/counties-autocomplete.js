import autoComplete from "@tarekraafat/autocomplete.js";

window.addEventListener("load", () => {
  const form = document.querySelector("#submit_zip_form");
  const input = form.querySelector("#js_zip_or_county");
  const button = form.querySelector("#submit_zip");

  if (!input) return;
  const counties = input.getAttribute("data-collection");
  if (!counties) return;
  const countiesAutocompleteSource = counties.split(",").map((c) => {
    const county = c.replace(/^\s*(.*\S)\s*$/, "$1");
    return county + (county === "San Francisco" ? "" : " County");
  });
  const autoCompleteInstance = new autoComplete({
    data: {
      src: countiesAutocompleteSource,
    },
    resultsList: {
      idName: "main_search_autocomplete_list",
    },
    selector: "#js_zip_or_county",
    query: {
      manipulate: (str) => {
        return str.trim();
      },
    },
    maxResults: 7,
    highlight: true,
    onSelection: (feedback) => {
      const selected = feedback.selection.value;
      const lang = document.documentElement.getAttribute("lang");
      const langPrefix = lang == "en" ? "" : `/${lang}`;
      const newUrl = `${langPrefix}/counties/${selected
        .replace(" County", "")
        .trim()
        .replace(/\ /g, "_")}`;
      window.location.href = newUrl;
    },
  });

  const getFirstResult = () => {
    const resultsList = document.querySelector(
      `#${autoCompleteInstance.resultsList.idName}`
    );
    if (resultsList) {
      return resultsList.firstChild;
    }
  };

  // Based on: https://github.com/TarekRaafat/autoComplete.js/issues/113
  input.addEventListener("rendered", (event) => {
    // Select autoComplete.js results list first child
    const firstResult = getFirstResult();
    if (firstResult) {
      // Add highlight class to the first result element
      firstResult.classList.add("autoComplete_selected");
    }
  });


  const clickFirstResult = function() {
    const firstResult = getFirstResult();
    if (firstResult) {
      firstResult.click();
    }
  };

  input.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      clickFirstResult();
    }
  });

  button.addEventListener("click", (event) => {
    clickFirstResult();
  });

  // Auto focus
  const findYourCounty = document.getElementById("js_find_your_county");
  if (findYourCounty) {
    findYourCounty.addEventListener("click", (e) => {
      e.preventDefault();
      input.scrollIntoView({ behavior: "smooth", block: "start" });
      input.focus();
    });
  }
});
