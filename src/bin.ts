#!/usr/bin/env ts-node

import { CURRENT_DIRECTORY } from './config/constants';
import { generateReport } from './lib';

generateReport(CURRENT_DIRECTORY);
