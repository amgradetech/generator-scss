# GENERATOR-SCSSFOLD
SCSS scaffold
  
## WHATS INSIDE
```
scss/
├── helpers/
│   ├── _backgrounds.scss
│   ├── _layout.scss
│   ├── _misc.scss
│   └── _responsive.scss
_text.scss
├── layout/
│   ├── partials/
│   ├── _layout.scss
│   ├── _content.scss
│   ├── _header.scss
│   ├── _sidebar.scss
│   └── _footer.scss
├── media/
│   └── _media.scss
├── pages/
|   └── ...
├── typography/
│   └── _typography.scss
├── util/
│   ├── custom/
│   ├── mixins/
│   ├── variables/
│   ├── _util.scss
│   ├── _sprite-set.scss
│   └── _variables-set.scss
├── core.scss
└── config.rb
```
## config.rb  
It is ready to be compiled with [compass](http://compass-style.org/).  

## core.scss
Core file contains @imports for everything in this kit:
``` javascript
// Utility files (mixins, variables, sprites etc)
@import 'util/util';

// Font-face declaration
@import "typography/typography";

// Main layout and reusable partials
@import "layout/layout";

// scss files for separate page
// @import "pages/...";

// Breakpoints manager
@import "media/media";
```

## helpers/  
There are classes for most common needs  

## layout/
Contains files with styles for site's common blocks (header, footer, body) and partials such as buttons, teasers, modals.

## media/
```This section is under developent```  
Contains helper mixins to make write responsive styles easier

## pages/
Here are files with unique styles per page

## typography/
Meant to contain font imports and declarations

## util/
This folder does not contain any styles to compile just variables, mixins, placeholders.
Import vendor mixins into it's __util.scss.  
@import it in every separate css file to use its contents.

## util/custom/
Is for custom mixins and placeholders for your site.
Don't forget to move some of them into general mixins folder and make merge request to this repo if you feel like they will be useful for every project.

## util/variables/
Base variables stucture:  

```
variables/
├── _colors.scss
├── _folders.scss/
├── _sizes.scss/
├── _typography.scss
└── _z-index-map.scss
```
