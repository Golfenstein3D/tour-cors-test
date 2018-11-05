# tour-cors-test

To make this work, you need to know the VenueID and round number.

For Tour, there are three rounds, so 0 = off, 3 = on (if there's only data for round 1, it won't display rounds 2 & 3).

The VenueID is based on the URL path of a venue found via [topgolf.com/us/locations](https://topgolf.com/us/locations), but with the hyphens removed...

 - `https://topgolf.com/us/edison/` -> `edison`
 - `https://topgolf.com/us/salt-lake-city/` -> `saltlakecity`

The Topgolf Tour TourneyID is `tour` + 2-digit year + VenueID...

 - `edison` -> `tour18edison`
 - `saltlakecity` -> `tour18saltlakecity`

You don't need to include `tour18` in the HTML, because the code in tgleaders.js prepends it...

 - `<a data-id="edison" data-rn="3" href="#">Edison, NJ</a>`
 - `<a data-id="saltlakecity" data-rn="0" href="#">Salt Lake City, UT</a>`

For the championship, templates are not in the data, and need to be added to the HTML.

See `bracket`, `leaders`, `bracket-template`, `leaders-template` in [index.html](blob/master/index.html).



### Working Example

[golfenstein3d.github.io/tour-cors-test](https://golfenstein3d.github.io/tour-cors-test/)

#### Initial Page Load

Set `data-id` and `data-rn` on a non-clickable element, in this case `<section id="#results"`

tgleaders.js calls: `tgleaders.pageInit($('#results'));`

#### Click Events

Set `data-id` and `data-rn` on links, and instead of linking to the href, it will display the leaders.

tgleaders.js sets events for: `$('.venue-col a').on('click',`

- `<a data-id="sample" data-rn="0" href="https://tgtour.leagueapps.com/">Sample, TEST</a>`
- `<a data-id="sample" data-rn="3" href="https://tgtour.leagueapps.com/">Sample, TEST</a>`

When the first link above is clicked, the link works normally and goes to the href URL.

When the second link is clicked, the code requests the leaders for 3 rounds of `tour18sample`...

 - `https://leaders.topgolfmedia.com/json/leaders_tour18sample_r1`
 - `https://leaders.topgolfmedia.com/json/leaders_tour18sample_r2`
 - `https://leaders.topgolfmedia.com/json/leaders_tour18sample_r3`

There are three parts to the championship (can't display a combined qualifier, unfortunately):

 - `<a data-id="qualifier1" data-rn="1" href="#">Championship Qualifier 1</a>`
 - `<a data-id="qualifier2" data-rn="1" href="#">Championship Qualifier 2</a>`
 - `<a data-id="final" data-rn="4" href="#">Championship Bracket</a>`



## OPTIMIZE

Production website must use minified css/js files.

