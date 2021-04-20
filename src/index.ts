#!/usr/bin/env node
import fs from 'fs/promises';
import { API_URL, getPackageInformation } from './api';
import { constructQuery, trimInformation, createDependencyFile } from './utils';

const FILE_MATCH = 'package.json';
const CURRENT_DIRECTORY = process.cwd();

async function loadFile(path: string): Promise<any> {
  try {
    const files: string[] = await fs.readdir(path);

    return files.filter(file => file === FILE_MATCH)[0];
  } catch (error) {
    console.error(`Failed to read ${error}`);
  }
}

async function loadDependencies(file: string): Promise<any> {
  try {
    const data = JSON.parse(await fs.readFile(file, 'binary'));

    return Object.keys({ ...data.devDependencies, ...data.dependencies });
  } catch (error) {
    console.error(`Failed to read ${error}`);
  }
}

async function aggregateDependencyResults(
  dependencies: string[],
): Promise<any> {
  const packageInformation = await Promise.all(
    dependencies.map(async dependecy => {
      return await getPackageInformation(API_URL, constructQuery(dependecy));
    }),
  );

  return JSON.stringify(trimInformation(packageInformation));
}

async function generateReport(path: string) {
  const file = await loadFile(path);
  const dependencies = await loadDependencies(file);

  const aggregatedDependencies = await aggregateDependencyResults(dependencies);
  createDependencyFile(aggregatedDependencies);
}

generateReport(CURRENT_DIRECTORY);
