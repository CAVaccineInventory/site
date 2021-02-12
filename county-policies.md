---
layout: default
title: titles.county_policies
permalink: /county-policies
add_to_nav: true
order: 3
---
<script src="{{ '/assets/js/airtable-autocomplete.js' | content_tag }}"></script>
{% t county_policies.text  %}

<div class="autoComplete_wrapper">
  {% assign counties_list = "" | split: "" %}
  {% for region in site.data.regions_counties %}
    {% assign counties_list = counties_list | concat: region[1] %}
  {% endfor %}
  {% assign counties = counties_list | join: ", " %}
  <input type="text" id="autoComplete" placeholder="{% t county_policies.search_by_county %}" class="{{ site.data.styles.input }}" autofocus data-collection="{{ counties }}" />
</div>

<iframe class="airtable-embed margin-top--l" src="https://airtable.com/embed/shrCqe8cuKc52Bqgb?backgroundColor=grayLight&viewControls=on" frameborder="0" onmousewheel="" width="100%" height="98%" style="background: transparent; border: 1px solid #ccc;"></iframe>
