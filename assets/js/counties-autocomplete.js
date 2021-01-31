window.addEventListener("load", () => {
  const inputSelector = "#js_zip_or_county";
  const input = document.querySelector(inputSelector);
  if (!input) return;
  const counties = input.getAttribute("data-collection");
  if (!counties) return;
  const countiesAutocompleteSource = counties
    .split(",")
    .map((c) => c.replace(/^\s*(.*\S)\s*$/, "$1"));
  const autoCompleteInstance = new autoComplete({
    data: {
      src: countiesAutocompleteSource,
    },
    resultsList: {
      idName: "main_search_autocomplete_list",
    },
    selector: inputSelector,
    maxResults: 7,
    highlight: true,
    resultItem: {
      content: (data, source) => {
        source.innerHTML =
          data.match + (data.value === "San Francisco" ? "" : " County");
      },
    },
    onSelection: (feedback) => {
      const selected = feedback.selection.value;
      const newUrl = `/counties/${selected
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

  input.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      const firstResult = getFirstResult();
      if (firstResult) {
        firstResult.click();
      }
    }
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
