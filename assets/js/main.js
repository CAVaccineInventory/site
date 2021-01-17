"use strict";

window.onload = () => {
  document.querySelector(".nav-button").addEventListener("click", (e) => {
    document.querySelector("nav").classList.toggle("is_open");
    e.preventDefault();
  });
};
