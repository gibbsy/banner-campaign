# HTML5 Banner workflow Gulp, SCSS, Uglify (ES5)

## Get started

1. $ npm install -g gulp

1. git clone https://github.com/gibbsy/banner-campaign 

1. $ npm install

1. Create a **banners/** directory to hold your banner code

* Templates for banner dev are available in **templates/**

* Banner folder structure must follow templates :

|-- banners
    |-- 300x250
        |-- dev
            |-- index.html
            |-- base.js *compiled to script.js*
            |-- style.scss *compiled to style.css*
            |-- assets
                |-- *.png, *.jpg, *.svg, *.gif
            |-- lib
                |-- *.js
        |-- dist

## Dev workflow features

* The workflow uses SASS so make use of its powers *mixins, variables etc*

* Some useful SASS mixins are included in **mixins/** eg *reset.scss*

* ES6 is not supported at this point due to filesize impact of necessary polyfills

* In the absence of ES6 modules you can @import external js files - thanks to https://github.com/nambo/gulp-js-import

* I keep reusable utils and classes handy in **utils/**

## Run your banner locally

* $ gulp --root=*insert banner directory name*

## Build your banner for production

* $ gulp b --root=*insert banner directory name*

* Your uglified, minified banner will be zipped up and waiting in the _delivery folder

## Build all the banners in the banner directory

* $ gulp b

* Your uglified, minified banners will be zipped up and waiting in the _delivery folder

:beers: