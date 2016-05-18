#!/usr/bin/env node

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
process.stdin.on('data', (data) => {
  clearTimeout(timeID);
  dataStdin += data;
});

process.stdin.on('end', () => {
  if (dataStdin === '') {
    process.exit(0);
  }

  const list = dataStdin.split(/\s+/).filter(Boolean);

  list.forEach(file => {
    const regexp = new RegExp(commander.pattern);
    const src = path.resolve(path.join(process.cwd(), file));
    const dest = path.resolve(file.replace(regexp, commander.dest));

    // create dest dir
    mkdirp.sync(path.dirname(dest));

    if (src !== dest) {
      const stats = fs.statSync(src);

      const shortSrc = path.relative(process.cwd(), src);
      const shortDest = path.relative(process.cwd(), dest);

      if (stats.isFile()) {
        // copy file to dest dir
        fs.createReadStream(src).pipe(fs.createWriteStream(dest));
        process.stdout.write(`✔ ${shortSrc} -> ${shortDest}\n`);
      } else if (stats.isDirectory()) {
        ncp(src, dest, (err) => {
          if (err) {
            process.stdout.write(`✗ ${shortSrc}: Error when copying the directory\n`);
          } else {
            process.stdout.write(`✔ ${shortSrc} -> ${shortDest}\n`);
          }
        });
      }
    } else {
      process.stdout.write(`✗ ${src}: Source and destination are the same\n`);
    }
  });
});
