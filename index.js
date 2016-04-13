#!/usr/bin/env node

// Copy files to a destination path computed from a regexp.
//
// Usage:
// ls lib/company*/src/**/*.{gif,png,jpg} 2>/dev/null | ls-to-cp -p '^lib\/([^\/]+).*\/([^\/]+)$' -d '/path/to/img/$1/$2'

const fs = require('fs');
const path = require('path');
const commander = require('commander');
const mkdirp = require('mkdirp');
const ncp = require('ncp').ncp;


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

  const list = dataStdin.split(/\s+/).filter(Boolean);

  list.forEach(file => {
    const regexp = new RegExp(commander.pattern);
    const dest = file.replace(regexp, commander.dest);

    // create dest dir
    mkdirp.sync(path.dirname(dest));

    const src = path.join(process.cwd(), file);

    if (src !== dest) {
      const stats = fs.statSync(src);

      if (stats.isFile()) {
        // copy file to dest dir
        fs.createReadStream(src).pipe(fs.createWriteStream(dest));
        process.stdout.write(`✔ ${file} -> ${dest}\n`);
      } else if (stats.isDirectory()) {
        ncp(src, dest, (err) => {
          if (err) {
            process.stdout.write(`✗ ${file}: Error when copying the directory\n`);
          } else {
            process.stdout.write(`✔ ${file} -> ${dest}\n`);
          }
        });
      }
    } else {
      process.stdout.write(`✗ ${file}: Source and destination are the same\n`);
    }
  })
});
