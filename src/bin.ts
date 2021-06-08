#!/usr/bin/env ts-node

import { Command } from 'commander';

import { generateReport } from './lib';
import * as pack from '../package.json';

const program = new Command();

program
  .version(pack.version)
  .option('-f, --url [path]', 'a GitHub package.json file url')
  .option(
    '-o, --out [out]',
    'the output folder for the generated dependency map',
  )
  .option(
    '-g, --use-global',
    'use a global dependo install instead of the dependency version',
  )
  .parse(process.argv);

generateReport(program.opts());
