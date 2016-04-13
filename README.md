# ls-to-cp

Copy files to a destination path computed from a regexp.

## Installation

`npm i -g ls-to-cp`

## How to use

Examples:

```
$ find node_modules -type d -regextype posix-extended -regex '.*company\..*dist/assets' | ls-to-cp -p '^node_modules/([^/]+)/dist' -d 'dist/assets/$1'
✔ node_modules/company.react-card/dist/assets -> dist/assets/company.react-card
✔ node_modules/company.react-button-nav/dist/assets -> dist/assets/company.react-button-nav
✔ node_modules/company.react-svg-icon/dist/assets -> dist/assets/company.react-svg-icon
✔ node_modules/company.react-spinner/dist/assets -> dist/assets/company.react-spinner
✔ node_modules/company.react-breadcrumbs/dist/assets -> dist/assets/company.react-breadcrumbs
```
