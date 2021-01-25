---
layout: default
title: Vaccination Sites
permalink: /vaccination-sites
add_to_nav: true
order: 5
---
<script type="module" src="{{ '/assets/js/airtable-autocomplete.js' | content_tag }}"></script>

{% t vaccination_sites.explainer  %}

<div class="autoComplete_wrapper">
  {% assign counties_list = "" | split: "" %}
  {% for region in site.data.regions_counties %}
    {% assign counties_list = counties_list | concat: region[1] %}
  {% endfor %}
  {% assign counties = counties_list | join: ", " %}
  <input type="text" id="autoComplete" placeholder="Search by county..." class="{{ site.data.styles.input }}" autofocus data-collection="{{ counties }}"  />
</div>

<iframe class="airtable-embed margin-top--l" src="https://airtable.com/embed/shrCSbzaiSiWdNB0s?backgroundColor=grayLight&viewControls=on" frameborder="0" onmousewheel="" width="100%" height="100%" style="background: transparent; border: 1px solid #ccc;"></iframe>
