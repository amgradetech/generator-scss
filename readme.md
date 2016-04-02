# GENERATOR-SCSSFOLD

[Yeoman](http://yeoman.io/) generator which scaffolds your SCSS files. 
  
## INSTALLIATION & USE  
  
Install it via npm:  
```  
npm i -g generator-scssfold  
```
and then use it like any other yeoman generator: 
```
yo scssfold
```
  
## WHATS INSIDE
```
scss/
├── helpers/
│   ├── __helpers.scss
│   ├── _backgrounds.scss
│   ├── _layout.scss
│   ├── _misc.scss
│   ├── _responsive.scss
│   └──_text.scss
├── layout/
│   ├── partials/
│   ├── __layout.scss
│   ├── _content.scss
│   ├── _header.scss
│   ├── _sidebar.scss
│   └── _footer.scss
├── pages/
|   └── ...
├── typography/
│   └── _typography.scss
├── util/
│   ├── custom-mixins/
│   ├── variables/
│   ├── __util.scss
│   └── _spriting.scss
├── core.scss
└── config.rb
```
## config.rb  
It is ready to be compiled with [compass](http://compass-style.org/).  

## core.scss
Core file contains @imports for everything in this kit:
``` javascript
// Utility files (mixins, variables, sprites etc)
@import 'util/__util';

// Font-face declaration
@import "typography/typography";

// Main layout and reusable partials
@import "layout/__layout";

// scss files for separate page
@import "pages/__pages";

// helper classes
@import "helpers/__helpers";

```

## helpers/  
There are classes for most common needs  

## layout/
Contains files with styles for site's common blocks (header, footer, body) and partials such as buttons, teasers, modals.

## pages/
Here are files with unique styles per page

## typography/
Meant to contain font imports and declarations

## util/
This folder does not contain any styles to compile just variables, mixins, placeholders.
``` javascript
// Variables
@import 'variables/__variables';

// Import mixins library
@import "../node_modules/scss-mixins-collection/mixins/__mixins.scss";

// Custom mixins
@import 'custom-mixins/__custom-mixins';
```  

Import vendor mixins into it's __util.scss.  
@import it in every separate css file to use its contents.

## util/custom-mixins/
Is for custom mixins and placeholders for your site.

## util/variables/
Base variables stucture:  

```
variables/
├── __variables.scss
├── _colors.scss
├── _folders.scss
├── _sizes.scss
├── _typography.scss
└── _z-index-map.scss
```

## bootstrap.scss  
  
You can add compiling of the bootstrap ^4.0 scss files into your folder. 
Just set path to the bootstrap's scss ( default: node_modules/bootstrap/scss ) folder and choose type of build. 
