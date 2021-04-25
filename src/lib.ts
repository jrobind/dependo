#!/usr/bin/env node
import fs from 'fs/promises';
import { API_URL, getPackageInformation } from './api';
import { constructQuery, trimInformation, createDependencyFile } from './utils';

export const FILE_MATCH = 'package.json';
export const CURRENT_DIRECTORY = process.cwd();

export async function loadFile(
  path: string,
  fileMatch: typeof FILE_MATCH,
): Promise<any> {
  try {
    const files: string[] = await fs.readdir(path);

    return files.filter(file => file === fileMatch)[0];
  } catch (error) {
    console.error(`Failed to read ${error}`);
  }
}

export async function loadDependencies(file: string): Promise<any> {
  try {
    const data = JSON.parse(await fs.readFile(file, 'binary'));

    return Object.keys({ ...data.devDependencies, ...data.dependencies });
  } catch (error) {
    console.error(`Failed to read ${error}`);
  }
}

export async function aggregateDependencyResults(
  dependencies: string[],
): Promise<any> {
  try {
    const packageInformation = await Promise.all(
      dependencies.map(async dependecy => {
        return await getPackageInformation(API_URL, constructQuery(dependecy));
      }),
    );

    return JSON.stringify(trimInformation(packageInformation));
  } catch (error) {
    console.error(error);
  }
}

export async function generateReport(path: string) {
  console.log();
  const file = await loadFile(path, FILE_MATCH);
  const dependencies = await loadDependencies(file);

  const aggregatedDependencies = await aggregateDependencyResults(dependencies);
  createDependencyFile(aggregatedDependencies);
}
