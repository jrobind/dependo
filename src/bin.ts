#!/usr/bin/env ts-node

import { CURRENT_DIRECTORY } from './constants';
import { generateReport } from './lib';

generateReport(CURRENT_DIRECTORY);
