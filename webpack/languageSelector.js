window.addEventListener("load", () => {
  const menu = document.querySelector("#language-selector");
  menu.addEventListener("change", (e) => {
    const currentLocation = window.location;
    const currentLang = document.documentElement.getAttribute("lang") || "en";
    let currentPath = currentLocation.pathname;
    if (currentLang !== "en" && currentPath.startsWith(`/${currentLang}`)) {
      currentPath = currentPath.slice(currentLang.length + 1);
    }

    const newLang = e.currentTarget.value;
    const newPrefix = newLang === "en" ? "" : `/${newLang}`;

    const newPath = newPrefix + currentPath;
    window.location = newPath;
  });
});
