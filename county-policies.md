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

<input
  class="js-county-filter rounded-full border border-gray-300
  hover:border-gray-400 focus:outline-none focus:border-gray-700 px-4 py-2 w-64"
  placeholder="{% t county_policies.search_by_county %}"
/>

<ul class="js-policies">

</ul>
