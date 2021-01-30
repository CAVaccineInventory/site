---
layout: default
title: titles.about_us
permalink: /about-us
add_to_nav: true
order: 6
---

{% t about_us.intro_1 %}

{% t about_us.intro_2 %}

{% t about_us.faq_header %}

{% t about_us.faq_help %}

{% t about_us.faq_help_answer_1 %}

{% t about_us.faq_help_answer_2 %}

{% t about_us.faq_help_answer_3 %}

{% t about_us.faq_help_answer_4 %}

{% t about_us.faq_help_answer_5 %}

{% t about_us.faq_press %}

{% t about_us.faq_press_answer %}

{% t about_us.faq_medical %}

{% t about_us.faq_medical_answer_1 %}

{% t about_us.faq_medical_answer_2 %}

{% t about_us.faq_medical_answer_3 %}

{% t about_us.faq_community %}

{% t about_us.faq_community_answer_1 %}

{% t about_us.faq_toil %}

{% t about_us.faq_toil_answr_1 %}

{% t about_us.faq_toil_answr_2 %}

{% t about_us.faq_accurate %}

{% t about_us.faq_accurate_answer_1 %}

{% t about_us.faq_accurate_answer_2 %}

{% t about_us.coordinators %} <span id="people-list">
{% for coordinator in site.data.coordinators %} <a href="{{ coordinator[1] }}">{{ coordinator[0] }}</a> {% endfor %}
</span>.


<script>
// From https://stackoverflow.com/a/12646864
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

const peopleElements = [...document.querySelectorAll('#people-list a')];
const peopleListElement = document.querySelector("#people-list");

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