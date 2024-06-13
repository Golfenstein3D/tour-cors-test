# tour-cors-test

## Hit Counter

Widget test pages

## Tour (retired)

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
    sudo npm install -g stylelint-order
    
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

