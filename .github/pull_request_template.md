<!--
	Replace this comment with a description of the change(s) being made.
	Screenshots are especially useful if you want to show how the site is changing.
	If relevant, try to reference Issue IDs that this PR resolves.
-->

<!--
	Replace the NNN in the URL below with the ID of this Pull Request.
	That's the URL where Netlify will automatically deploy a staging build.
-->
Link to Deploy Preview: https://deploy-preview-NNN--vaccinateca.netlify.app/

---

### Manual Testing (QA)

_(Note: Use your best judgement for time management. If this PR is a minor content adjustment, you might not invest in the full list of QA checks below. But for medium-large PRs, we recommend a thorough review.)_

Open the deploy preview and manually perform the following tests with the browser's developer console open. Fix or log any unexpected errors you see in the console. Check off the following manual tests as you go through them. Make sure to resize the screen and check for poorly positioned or spaced items at mobile and tablet sizes (60%+ of our audience is on mobile devices).

#### Homepage
- [ ] Click all the links, internal and external, make sure all open the expected content.
- [ ] Verify map pins show information, can locate by geolocation

#### /near-me
- [ ] Verify searching by geolocation
- [ ] Verify searching by zip code (Use one you're familiar with and double-check the listings are what you'd expect)
- [ ] Run seaches using different options of the filters dropdown
- [ ] Vaccination Site Cards show relevant information and whether location is within your county
- [ ] Address in Vaccination Site Cards links to Google Maps view

#### /regions/* and /vaccination-sites
- [ ] List of locations displays successfully on load
- [ ] Typing into the 'Search by county...' field activates autocomplete and filters the list of locations
- [ ] Region pages should list the region's counties, each linked to its County Page

#### /counties/*
- [ ] List of locations displays successfully on load, split into sites with vaccine and without vaccine
- [ ] Vaccination Site Cards show relevant information

#### County Policies page
- [ ] Shows list of policies per county
- [ ] Has search bar that autocompletes and filters content

### Vaccination Sites page
- [ ] Lists all vaccination sites
- [ ] Has search bar that autocomplete and filters content

#### Other Pages
- [ ] 'Providers' shows list of providers
- [ ] 'About Us' shows prose content and FAQ
- [ ] 'About Us' shows randomized list of coordinators' names

#### Did you remember to:
- [ ] Check for errors in the developer console?
- [ ] Resize the window to check for display/positioning issues at mobile and tablet sizes?
- [ ] Check if page titles (what shows in the browser tab) are set properly?
