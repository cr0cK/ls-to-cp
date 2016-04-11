# ls-to-cp

Copy files to a destination path computed from a regexp.

## Installation

`npm i -g ls-to-cp`

## How to use

Examples:

```
$ ls lib/mycompany*/src/**/*.{gif,png,jpg} 2>/dev/null | ls-to-cp -p '^lib\/([^\/]+).*\/([^\/]+)$' -d '/home/cr0cK/img/$1/$2'
✔ lib/mycompany.react-lib/src/img/local-loader.gif -> /home/cr0cK/img/mycompany.react-lib/local-loader.gif
✔ lib/mycompany.react-lib/src/styles/logo.png -> /home/cr0cK/img/mycompany.react-lib/logo.png
```
