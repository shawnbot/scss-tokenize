#!/usr/bin/env node
const fse = require('fs-extra')
const yaml = require('js-yaml')
const yargs = require('yargs')
  .usage('$0 [options] [files..]')
  .version(require('./package.json').version)
  .option('x', {
    alias: 'expand',
    boolean: true,
    desc: 'Attempt to expand variables so that "$a: 1; $b: $a" -> {a: 1, b: 1}',
  })
  .option('y', {
    alias: 'yaml',
    boolean: true,
    desc: 'Output YAML instead of JSON',
  })
  .option('p', {
    alias: 'pretty',
    boolean: true,
    desc: 'Pretty-print JSON output',
  })
  .option('o', {
    desc: 'Write to a file instead of stdout'
  })
  .option('help', {
    alias: 'h',
    desc: 'Show this useful help',
  })
  .wrap(70)

const options = yargs.argv
const args = options._
const yamlOpts = {} // TODO

const {readFiles} = require('./lib/io')
const {tokenize, interpolate} = require('.')

readFiles(args.length ? args : ['/dev/stdin'])
  .then(parsed => {
    return parsed.reduce((tokens, scss) => {
      const parsed = tokenize(scss, options)
      return Object.assign(tokens, parsed)
    }, {})
  })
  .then(tokens => {
    return options.expand
      ? interpolate(tokens)
      : tokens
  })
  .then(tokens => {
    if (options.yaml) {
      return yaml.safeDump(tokens, yamlOpts)
    } else {
      return options.pretty
        ? JSON.stringify(tokens, null, '  ')
        : JSON.stringify(tokens)
    }
  })
  .then(output => {
    if (options.o) {
      return fse.writeFile(options.o, output, 'utf8')
    } else {
      console.log(output)
    }
  })
