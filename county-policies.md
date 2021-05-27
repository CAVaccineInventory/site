---
layout: default
title: titles.county_policies
permalink: /county-policies
add_to_nav: false
order: 2
---
<script src="/assets/js/policies.js"></script>

<h1 class="text-3xl p-10 mb-10 bg-red-200 shadow border-gray-300" >As of May 27, 2021, these county policy links are no longer being updated by VaccinateCA. Please check the county's website for current policy information.</h1>

<div
  class="bg-white w-96 flex items-center rounded-full
  focus:outline-none border border-gray-300
  hover:border-gray-500">
  <input
    class="js-county-filter rounded-s-full w-full px-4 text-gray-700 leading-tight focus:outline-none"
    placeholder="{% t county_policies.search_by_county %}"
  />
  <svg
    id="js-clear-button"
    class="invisible rounded-full p-2 fill-current h-12 w-12 text-gray-500 focus:outline-none"
    role="button"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"><title>Clear</title><path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/></svg>
</div>
<div id="js-autocomplete-results-location"></div>


<div class="bg-gray-50 p-4 shadow mt-4 mb-4 text-sm">
  <p>{% t county_policies.text %}</p>
</div>

<ul class="js-policies">

</ul>
