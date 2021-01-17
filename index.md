---
# Feel free to add content and custom Front Matter to this file.
# To modify the layout, see https://jekyllrb.com/docs/themes/#overriding-theme-defaults

layout: default
title: California Covid-19 Vaccine Availability
---
**The State of California has
[approved](https://www.npr.org/2021/01/13/956574947/california-to-vaccinate-residents-65-or-older-against-covid-19)
giving the COVID-19 vaccine to people age 65 and older.** We are calling hospitals and pharmacies daily to check which
are currently administering vaccines. Since our first call on January 14th, we've contacted 500+ vaccination sites, and
aim to call several hundred more this weekend (January 16th - 17th). Our goal is getting shots in arms as quickly as
possible for you or your loved ones.
We intend to call [all the vaccination sites in California](./vaccination-sites). If you have
a missing location to report, or think we have incorrect contact information, [please let us
know](https://airtable.com/shrY44NvEjHBscrOH).

We've also compiled county policies on [vaccination here](./county-policies).

<div class="flex-responsive margin-top--xl">
    <div class="flex1">
        <h3>These places told us they have the vaccine within the last few days. Call before going, or make an appointment, as supplies are limited.</h3>

        <h3>If you can't find the vaccination site you're looking for, it's possible they said they do not have the vaccine, or that we have not contacted them yet.</h3>

        <h3>You can find our full list of sites with their status <a href="{% link vaccination-sites.md %}">here</a></h3>
        
        <p>Click a pin on the map to see contact information and other info about getting the vaccine.</p>

        <a class="button margin-top--m" href="https://airtable.com/shrOMv5EI1jYwV1XR">Let us know if you found this site helpful!</a>
    </div>
    <div class="flex1">
        {% include map.html %}
    </div>
</div>

<!-- height is less than 100% to avoid double scrollbars -->
<iframe class="airtable-embed margin-top--xl"
    src="https://airtable.com/embed/shrzL2Lo5CrlkMmQ7?backgroundColor=grayLight&viewControls=on" frameborder="0"
    onmousewheel="" width="100%" height="98%" style="background: transparent; border: 1px solid #ccc;"></iframe>

<div class="margin-top--xl .flex-spaced-centered">
  <h2 style="text-align: center">As seen on</h2>
</div>

<div class="flex-responsive margin-top--s">
  <div class="flex2 padding-right--m">
    <img src="/assets/img/vox.png" alt="Vox logo"/>
  </div>
  <div class="flex10">
    <h3><a href="">How Californians are resorting to crowdsourcing to get their Covid-19 vaccine</a></h3>


    <em><p>Californians are taking matters into their own hands: they’re crowdsourcing it. In the last two days, an effort has sprung up to report on where shots are available to the elderly. Volunteers have set up a spreadsheet with a simple premise: One person can call each location every day and ask if vaccines are available, and then publish the information for everyone to see.</p> 

    <p>... And the site has already been used to get some people vaccinated.</p></em>
  </div>
</div>