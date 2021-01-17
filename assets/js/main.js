// Stub for custom JS

window.onload = () => {
  document.querySelector(".nav-button").addEventListener("click", (e) => {
    document.querySelector("nav").classList.toggle("open");
    e.preventDefault();
  });
};
