---
layout: default
title: About Us
permalink: /about-us
add_to_nav: true
order: 6
---
We are an ad hoc collection of volunteers, trying to move as quickly as possible to get Californians up-to-date COVID-19 vaccine information. We have a core team of approximately ten people and approximately 100 volunteers calling to find out about vaccine availability.

Some of us (so you know we're "real people"): <span id="people-list">
{% for coordinator in site.data.coordinators %} [{{ coordinator[0] }}]({{ coordinator[1] }}) {% endfor %}
</span>.

<h2 class="text-2xl font-bold leading-tight text-gray-900">
Frequently Asked Questions (FAQ)
</h2>

**How can I help?**

Get the word out about the vaccine in your community. Help your eligible loved ones get the vaccine. Continue wearing your mask and observe social distancing guidelines.

We do not need more volunteers right now; we're running this out of our networks to move as quickly as possible. This may change in a few days; check back for updates or [follow us on Twitter](https://twitter.com/{{ site.twitter_username }}).

We also don't need money. Many charitable projects _do_; they would appreciate your generous support.

**I am a reporter. Can I get in touch?**

Please email [media@vaccinateca.com](mailto:media@vaccinateca.com); we'll be in touch quickly.

**I work at a medical provider! How do I ask you to update our information or make a request of you?**

We appreciate the work you are doing, and are here to support it!

Please text [(415) 301-4597](tel:+14153014597) with your message, institutional affiliation, and an internal extension or contact name so we can call back to verify. We cannot receive photos at this number; text only, please.

One of the organizers will read your message and take action as soon as reasonably possible.

**I work in a community-facing organization or for the government. Can we discuss this?**

We want to support the urgent work you are doing in getting Californians vaccinated as quickly as possible. Please email us at [partners@vaccinateca.com](mailto:partners@vaccinateca.com) to discuss.

**Does this effort increase or decrease toil in the healthcare system?**

Most hospitals will get thousands of phone calls per day. They are currently being slammed by many more people than usual asking them the same question: "Do you have the vaccine?"

By asking that question and publishing the answer, we can save their phone bandwidth for the day-to-day operations of the hospital. We also save people seeking the vaccine from having to call dozens of locations to find one that has availability.

**Is the information on this website accurate?**

We publish only what the vaccine site told us when we called. The situation is complex, supplies may vary throughout the day, and not everyone at the site might have up-to-the-minute information as to what their policies actually are.

We're doing our best, but can't make any guarantees.

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
