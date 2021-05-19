import fs from 'fs/promises';
import { API_URL, getPackageInformation } from './api';
import * as Eta from 'eta';
import myTemplate from './templates/template';
import {
  constructQuery,
  refineInformation,
  getNumberOfDepenencies,
} from './utils';

export const FILE_MATCH = 'package.json';
export const CURRENT_DIRECTORY = process.cwd();

export async function loadFile(
  path: string,
  fileMatch: typeof FILE_MATCH,
): Promise<any> {
  try {
    const files: string[] = await fs.readdir(path);

    return files.find(file => file === fileMatch);
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

    return JSON.stringify(refineInformation(packageInformation));
  } catch (error) {
    console.error(error);
  }
}

export async function createReportFile(data: string) {
  try {
    const response = data;
    const { dependencies, devDependencies } = await getNumberOfDepenencies(
      `${CURRENT_DIRECTORY}/${FILE_MATCH}`,
    );

    const result = Eta.render(myTemplate, {
      dependencies,
      devDependencies,
    }) as string;

    await fs.writeFile(`${process.cwd()}/dependo.html`, result);
  } catch (error) {
    console.error(error);
  }
}

export async function generateReport(path: string) {
  const file = await loadFile(path, FILE_MATCH);
  const dependencies = await loadDependencies(file);

  const aggregatedDependencies = await aggregateDependencyResults(dependencies);
  createReportFile(aggregatedDependencies);
}
