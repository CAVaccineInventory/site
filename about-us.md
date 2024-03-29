---
layout: default
title: titles.about_us
permalink: /about-us
add_to_nav: true
order: 4
---

{% t about_us.intro_1 %}

{% t about_us.intro_2 %}

<h2 class="text-2xl font-bold leading-tight text-gray-900 mt-8 mb-4">
  {% t about_us.equity_title %}
</h2>

{% t about_us.equity %}

<h2 class="text-2xl font-bold leading-tight text-gray-900 mt-8 mb-4">
  {% t about_us.faq_header %}
</h2>

<h3 class="text-lg font-bold mb-2 bg-yellow-300 px-0.5 py-1">
  {% t about_us.faq_help %}
</h3>

{% t about_us.faq_help_answer_1 %}

{% t about_us.faq_help_answer_2 %}

{% t about_us.faq_help_answer_3 %}

{% t about_us.faq_help_answer_4 %}

{% t about_us.faq_help_answer_5 %}

<h3 class="text-lg font-bold mt-6 mb-2 bg-yellow-300 px-0.5 py-1">
  {% t about_us.faq_press %}
</h3>

{% t about_us.faq_press_answer %}

<h3 class="text-lg font-bold mt-6 mb-2 bg-yellow-300 px-0.5 py-1">
  {% t about_us.faq_medical %}
</h3>

{% t about_us.faq_medical_answer_1 %}

{% t about_us.faq_medical_answer_2 %}

{% t about_us.faq_medical_answer_3 %}

<h3 class="text-lg font-bold mt-6 mb-2 bg-yellow-300 px-0.5 py-1">
  {% t about_us.faq_community %}
</h3>

{% t about_us.faq_community_answer_1 %}

<h3 class="text-lg font-bold mt-6 mb-2 bg-yellow-300 px-0.5 py-1">
  {% t about_us.faq_toil %}
</h3>

{% t about_us.faq_toil_answr_1 %}

{% t about_us.faq_toil_answr_2 %}

<h3 class="text-lg font-bold mt-6 mb-2 bg-yellow-300 px-0.5 py-1">
  {% t about_us.faq_accurate %}
</h3>

{% t about_us.faq_accurate_answer_1 %}

{% t about_us.faq_accurate_answer_2 %}

<h3 class="text-lg font-bold mt-6 mb-2 bg-yellow-300 px-0.5 py-1">
  {% t about_us.coordinators %}
</h3>
<div dir="ltr" class="text-left">
  <span id="js-people-list">
    {% for coordinator in site.data.coordinators %} <a href="{{ coordinator[1] }}">{{ coordinator[0] }}</a> {% endfor %}
  </span>.
</div>
<h3 class="text-lg font-bold mt-6 mb-2 bg-yellow-300 px-0.5 py-1">
Who is behind this project?
<h3>
<div dir="ltr" class="text-left">
<span>
VaccinateCA is a project of Call The Shots, a nonprofit organization that also runs the national Vaccinate The States effort. Hundreds of volunteers across the country are the heart of the operation, and make our efforts possible. To reach our management team with feedback, comments, or questions, please contact:
</span>
<ul class="py-1">
<li>Jesse Vincent, Chief Operating Officer: jesse@vaccinateca.com</li>
<li>Zoelle Egner, Chief Communications Officer: zoelle@vaccinateca.com</li>
</ul>
</div>


<script>
// From https://stackoverflow.com/a/12646864
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

const peopleElements = [...document.querySelectorAll('#js-people-list a')];
const peopleListElement = document.getElementById("js-people-list");

shuffleArray(peopleElements);
peopleListElement.innerHTML = "";
for (let i = 0; i < peopleElements.length; ++i) {
  const personElement = peopleElements[i];

  peopleListElement.insertBefore(personElement, null);
  if (i !== peopleElements.length - 1) {
    const separatorNode = document.createTextNode(", ");
    peopleListElement.insertBefore(separatorNode, null);
  }
}
</script>
