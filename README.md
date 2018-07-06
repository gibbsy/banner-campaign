# HTML5 Banner workflow Gulp, SCSS, livereload, Uglify (ES5)

## Get started

1. `$ npm install -g gulp`  

1. `git clone https://github.com/gibbsy/banner-campaign your-directory-name`

1. `$ cd your-directory-name`

1. `$ npm install`

1. `$ mkdir banners` **- build your banners in here**

## Important things to note

* Templates for banner dev are available in **templates/**

* Banner folder structure must follow templates ie:

  * Onpage banner

```
|-- banners
    |-- 300x250
        |-- dev
            |-- index.html
            |-- base.js *compiled to script.js*
            |-- manifest.js *flashtalking platform specific*
            |-- style.scss *compiled to style.css*
            |-- assets
                |-- *.png, *.jpg, *.svg, *.gif
            |-- lib
                |-- *.js
        |-- dist
```

  * Richload banner (Flashtalking)

  ```
|-- banners
    |-- 300x250
        |-- base
            |-- index.html
            |-- manifest.js *flashtalking platform specific*
            |-- style.css 
        |-- richload
            |-- dev
                |-- index.html
                |-- base.js *compiled to script.js using gulp-js-import*
                |-- style.scss *compiled to style.css*
                |-- assets
                    |-- *.png, *.jpg, *.svg, *.gif
                |-- lib
                    |-- *.js
            |-- dist
```

## Dev workflow features

* The workflow uses SASS so make use of its powers *mixins, variables etc*

* Some useful SASS mixins are included in **mixins/** eg *reset.scss*

* ES6 is not supported at this point due to filesize impact of necessary [polyfills (106kb minified)](https://cdnjs.cloudflare.com/ajax/libs/babel-polyfill/6.26.0/polyfill.min.js)

* In the absence of ES6 modules you can @import external js files into your base.js - thanks to https://github.com/nambo/gulp-js-import

  * **The resulting script.js file will be generated in the dev folder**
  
  * Do not load base.js in your index.html - load script.js (even if you don't use @import feature)

* I keep reusable utils and classes handy in **utils/**

## Run your banner locally

* $ gulp --root=*banner-directory-name*

* **Gulp watch** task watches your .scss files (including mixin folder) and compiles and reloads automatically

* Livereload also performed when .html or .js files change 

## Build your banner for production

* $ gulp b --root=*banner-directory-name*

* Your uglified, minified banner will be zipped up and waiting in the **_delivery** directory

## Build all the banners in the banners directory

* $ gulp b

* Your uglified, minified banners will be zipped up and waiting in the **_delivery** directory

:beers: