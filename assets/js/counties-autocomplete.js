window.onload = () => {
  const inputSelector = "#zipOrCounty";
  const input = document.querySelector(inputSelector);
  if (!input) return;
  const counties = input.getAttribute("data-collection");
  if (!counties) return;
  const countiesAutocompleteSource = counties
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
    resultsList: {
      idName: "main_search_autoComplete_list",
    },
    selector: inputSelector,
    maxResults: 7,
    highlight: true,
    onSelection: (feedback) => {
      const selected = feedback.selection.value;
      window.location.href = `/counties/${selected
        .replace(" County", "")
        .replace(" ", "_")}`;
    },
  });

  // Auto focus
  const findYourCounty = document.getElementById("find_your_county");
  if (findYourCounty) {
    findYourCounty.addEventListener("click", (e) => {
      e.preventDefault();
      input.scrollIntoView({ behavior: "smooth", block: "start" });
      input.focus();
    });
  }
};
