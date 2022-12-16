# tour-cors-test

To make this work, you need to know the VenueID and round number.

For Tour, there are three rounds, so 0 = off, 3 = on (if there's only data for round 1, it won't display rounds 2 & 3).

The VenueID is based on the URL path of a venue found via [topgolf.com/us/locations](https://topgolf.com/us/locations), but with the hyphens removed...

 - `https://topgolf.com/us/edison/` -> `edison`
 - `https://topgolf.com/us/las-vegas/` -> `lasvegas`

The Topgolf Tour TourneyID is `tour` + 2-digit year + VenueID...

 - `lasvegas` -> `tour19lasvegas`

You don't need to include `tour19` in the HTML for the current year, because tgleaders.js prepends it.
However, data-year should be added so it continues to load this year's data in January of next year.

 - `<a data-year="19" data-id="lasvegas" data-rn="0" href="#">Las Vegas, NV</a>`

For the championship, templates are not in the data, and need to be added to the HTML.

See `bracket`, `leaders`, `bracket-template`, `leaders-template` in [index.html](./index.html).



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

Non-minified css has been removed from this repo.  If you need to make changes...


### Node.js

Download and install [Node v10.15.2](https://nodejs.org/dist/latest-v10.x/) or higher.
Node is not just a server thing.
[Tools from NPM](https://www.npmjs.com/search?q=keywords:css) streamline client-side web development.

The following commands install packages globally (`-g`) so you can use them from the command line.
(Don't use `sudo` on Windows.)

    sudo npm install -g browserslist
    sudo npm install -g less
    sudo npm install -g less-plugin-autoprefix
    sudo npm install -g less-plugin-clean-css
    sudo npm install -g stylelint
    
    sudo npm install -g uglify-js
    sudo npm install -g eslint
    sudo npm install -g eslint-plugin-dollar-sign

Go to the assets directory to run the comands below...

    cd assets


### CSS

DEV: LESS to CSS

    lessc tgleaders.less tgleaders.css

quality check (see .stylelintrc)

    stylelint tgleaders.css

PROD: add browser prefixes (see .browserslistrc) and minify

    lessc tgleaders.less tgleaders.min.css --autoprefix --clean-css


### JavaScript

DEV: quality check (see .eslintrc)

    eslint tgleaders.js

PROD: minify

    uglifyjs tgleaders.js -o tgleaders.min.js

