#!/usr/bin/env ts-node

import { Command } from 'commander';

import { extractRepoFileData } from './utils';
import { generateReport } from './lib';
import * as pack from '../package.json';

const program = new Command();

program
  .version(pack.version)
  .option('-f, --file [path]', 'a GitHub package.json file url')
  .option(
    '-o, --out [out]',
    'the output folder for the generated dependency map',
  )
  .parse(process.argv);

const options = program.opts();

if (options.file) {
  generateReport(extractRepoFileData(options.file));
} else {
  generateReport();
}
