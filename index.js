#!/usr/bin/env node

// Copy files to a destination path computed from a regexp.
//
// Usage:
// ls lib/company*/src/**/*.{gif,png,jpg} 2>/dev/null | ls-to-cp -p '/^lib\/([^\/]+).*\/([^\/]+)$/' -d '/path/to/img/$1/$2'

const fs = require('fs');
const path = require('path');
const commander = require('commander');
const mkdirp = require('mkdirp');

commander
  .option('-p, --pattern <regexp>', 'Regexp used to parse the lists on stdin (ex: "^lib\/([^\/]+).*\/([^\/]+)$"')
  .option('-d, --dest <string>', 'String that owns pattern matches (ex: /path/to/img/$1/$2')
  .parse(process.argv);

/* Main */

if (process.argv.length < 3) {
  process.stdout.write('Missing arguments.');
  commander.help();
  process.exit(1);
}

process.stdin.resume();
process.stdin.setEncoding('utf8');

const timeID = setTimeout(() => {
  process.stdout.write('No data received from stdin!');
  commander.help();
  process.exit(1);
}, 2000);

var dataStdin = '';
process.stdin.on('data', function(data) {
  clearTimeout(timeID);
  dataStdin += data;
});

process.stdin.on('end', function() {
  if (dataStdin === '') {
    process.exit(1);
  }

  const files = dataStdin.split(/\s+/).filter(Boolean);

  files.forEach(file => {
    const regexp = new RegExp(commander.pattern);
    const destPath = file.replace(regexp, commander.dest);

    // create dest dir
    mkdirp.sync(path.dirname(destPath));

    // copy file to dest dir
    fs.createReadStream(file).pipe(fs.createWriteStream(destPath));

    process.stdout.write(`✔ ${file} -> ${destPath}\n`);
  })
});
