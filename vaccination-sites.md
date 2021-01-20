---
layout: default
title: Vaccination Sites
permalink: /vaccination-sites
add_to_nav: true
order: 4
---

This is a list of all of the sites we are aware of in California which may, at
some point, receive the COVID-19 vaccine. **Most of them do not have the vaccine
available today**; we are calling as many as we can daily to update the list. If
we missed a site, [let us know](https://airtable.com/shrY44NvEjHBscrOH)! We are
working on expanding the list with additional pharmacies and other locations.

<div class="autoComplete_wrapper">
  {% assign counties_list = "" | split: "" %}
  {% for region in site.data.regions_counties %}
    {% assign counties_list = counties_list | concat: region[1] %}
  {% endfor %}
  {% assign counties = counties_list | join: ", " %}
  <input type="text" id="autoComplete" placeholder="Search by county..." class="{{ site.data.styles.input }}" autofocus data-collection="{{ counties }}"  />
</div>

<iframe class="airtable-embed margin-top--l" src="https://airtable.com/embed/shrCSbzaiSiWdNB0s?backgroundColor=grayLight&viewControls=on" frameborder="0" onmousewheel="" width="100%" height="100%" style="background: transparent; border: 1px solid #ccc;"></iframe>
