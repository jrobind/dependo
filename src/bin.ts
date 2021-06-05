#!/usr/bin/env ts-node

import { reformatFileUrl } from './utils';
import { generateReport } from './lib';

const args = process.argv.slice(2);

if (args.length) {
  generateReport(reformatFileUrl(args[0]));
} else {
  generateReport();
}
