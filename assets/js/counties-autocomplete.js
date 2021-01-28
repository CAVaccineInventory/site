window.addEventListener("load", () => {
  const inputSelector = "#js_zip_or_county";
  const input = document.querySelector(inputSelector);
  if (!input) return;
  const counties = input.getAttribute("data-collection");
  if (!counties) return;
  const countiesAutocompleteSource = counties
    .split(",")
    .map((c) => c.replace(/^\s*(.*\S)\s*$/, "$1"));
  new autoComplete({
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
        .replaceAll(" ", "_")}`;
      window.location.href = newUrl;
    },
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
