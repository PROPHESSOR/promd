#!/usr/bin/env node
/* eslint no-console:0*/

'use strict';


const fs = require('fs');
const argparse = require('argparse');


// //////////////////////////////////////////////////////////////////////////////

const cli = new argparse.ArgumentParser({
  'prog': 'promd',
  'version': require('./package.json').version,
  'addHelp': true
});

cli.addArgument(['--no-html'], {
  'help': 'Disable embedded HTML',
  'action': 'storeTrue'
});

cli.addArgument(['-l', '--linkify'], {
  'help': 'Disable autolink text',
  'action': 'storeTrue'
});

cli.addArgument(['-t', '--typographer'], {
  'help': 'Disable smartquotes and other typographic replacements',
  'action': 'storeTrue'
});

cli.addArgument(['-s', '--subsup'], {
  'help': 'Disable <sub/> (~text~) and <sup/> (^text^) features',
  'action': 'storeTrue'
});

cli.addArgument(['-b', '--breaks'], {
  'help': 'Glue several lines into one (don\'t put <br/> after every line breaks)',
  'action': 'storeTrue'
});

cli.addArgument(['--trace'], {
  'help': 'Show stack trace on error',
  'action': 'storeTrue'
});

cli.addArgument(['file'], {
  'help': 'File to read',
  'nargs': '?',
  'defaultValue': '-'
});

cli.addArgument(['-o', '--output'], {
  'help': 'File to write',
  'defaultValue': '-'
});

const options = cli.parseArgs();

if (process.argv.length) console.log('Write your markdown text and press Ctrl+D to generate HTML');

function readFile(filename, encoding, callback) {
  if (options.file === '-') {
    // read from stdin
    const chunks = [];

    process.stdin.on('data', (chunk) => {
 chunks.push(chunk);
});

    process.stdin.on('end', () => callback(null, Buffer.concat(chunks).toString(encoding)));
  } else {
    fs.readFile(filename, encoding, callback);
  }
}


// //////////////////////////////////////////////////////////////////////////////

readFile(options.file, 'utf8', (err, input) => {
  if (err) {
    if (err.code === 'ENOENT') {
      console.error('File not found: ' + options.file);
      process.exit(2);
    }

    console.error(
      options.trace && err.stack
      || err.message
      || String(err));

    process.exit(1);
  }

  const md = require('markdown-it')({
    'html': !options.no_html,
    'xhtmlOut': false,
    'typographer': !options.typographer,
    'linkify': !options.linkify,
    'breaks': !options.breaks
  });

  md.use(require('markdown-it-ins'));
  // md.use(require('./modules/underscore')); // TODO:
  if (!options.subsup) {
    md.use(require('markdown-it-sub'));
    md.use(require('markdown-it-sup'));
  }

  let output;

  try {
    output = md.render(input);
  } catch (e) {
    console.error(
      options.trace && e.stack
      || e.message
      || String(e));

    process.exit(1);
  }

  if (options.output === '-') {
    // write to stdout
    process.stdout.write(output);
  } else {
    fs.writeFileSync(options.output, output);
  }
});