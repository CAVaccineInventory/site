---
layout: default
title: County Policies
permalink: /county-policies
add_to_nav: true
order: 3
---
<script type="module" src="/assets/js/county-policies.js"></script>
The state of California has a vaccine strategy, but has delegated prioritization and administration to each county. Decisions as to which patients to vaccinate and in what fashion are ultimately up to medical providers.

We have collected the **most recent county-level information** below. Broadly, we think that if the information we have on file from a county disagrees with a medical provider in it, the one most likely to be right is the one who could (or could not) put a shot in someone's arm.

Some counties have set up scheduling systems or have advice; please check your county below.

<div class="autoComplete_wrapper">
  {% assign counties_list = "" | split: "" %}
  {% for region in site.data.regions_counties %}
    {% assign counties_list = counties_list | concat: region[1] %}
  {% endfor %}
  {% assign counties = counties_list | join: ", " %}
  <input type="text" id="autoComplete" placeholder="Search by county..." class="{{ site.data.styles.input }}" autofocus data-collection="{{ counties }}" />
</div>

<iframe class="airtable-embed margin-top--l" src="https://airtable.com/embed/shrCqe8cuKc52Bqgb?backgroundColor=grayLight&viewControls=on" frameborder="0" onmousewheel="" width="100%" height="98%" style="background: transparent; border: 1px solid #ccc;"></iframe>
