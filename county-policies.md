---
layout: default
title: titles.county_policies
permalink: /county-policies
add_to_nav: true
order: 3
---
<script src="/assets/js/policies.js"></script>

<script id="js-county-policy-labels" type="application/json">
  {
    "vaccineInfo": "{% t policy.vaccine_info %}",
    "vaccineLocations": "{% t policy.vaccine_locations %}",
    "vaccineAppointments": "{% t policy.vaccine_appointments %}",
    "volunteerOpportunities": "{% t policy.volunteer_opportunities %}",
    "latestInfo": "{% t global.latest_info %}"
  }
</script>

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

<ul class="js-policies">

</ul>
