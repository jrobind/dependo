import fs from 'fs/promises';
import * as Eta from 'eta';

import {
  FILE_MATCH,
  STYLES_PATH,
  API_URL,
  ETA_TEMPLATES,
  DependencyType,
} from '../config/constants';
import { getPackageInformation } from '../api';
import {
  PackageMeta,
  PackageInformation,
  TemplateDependecyData,
} from '../interfaces/shared';
import {
  constructQuery,
  refineInformation,
  splitDependenciesByType,
} from '../utils';
import '../config';

export async function loadFile(
  path: string,
  fileMatch: typeof FILE_MATCH,
): Promise<any> {
  try {
    const files: string[] = await fs.readdir(path);

    return files.find(file => file === fileMatch);
  } catch (error) {
    throw new Error(error);
  }
}

export async function loadDependencies(file: string): Promise<PackageMeta[]> {
  try {
    const data = JSON.parse(await fs.readFile(file, 'binary'));

    return Object.keys({ ...data.dependencies })
      .map(dep => ({ name: dep, type: DependencyType.DEPENDENCY }))
      .concat(
        Object.keys({ ...data.devDependencies }).map(devDep => ({
          name: devDep,
          type: DependencyType.DEV_DEPENDENCY,
        })),
      );
  } catch (error) {
    throw new Error(error);
  }
}

export async function aggregateDependencyResults(
  dependencies: PackageMeta[],
): Promise<PackageInformation[]> {
  try {
    const packageInformation = await Promise.all(
      dependencies.map(async dependecy => {
        const packageInfo = await getPackageInformation(
          API_URL,
          constructQuery(dependecy.name),
        );
        packageInfo.type = dependecy.type;

        return packageInfo;
      }),
    );

    return refineInformation(packageInformation);
  } catch (error) {
    throw new Error(error);
  }
}

export async function createReportFile(data: PackageInformation[]) {
  try {
    const css = await fs.readFile(STYLES_PATH, 'binary');
    const depData: TemplateDependecyData = splitDependenciesByType(data);
    const result = (await Eta.renderFile(ETA_TEMPLATES, {
      css,
      totalDeps: depData.dependencies.length,
      totalDevDeps: depData.devDependencies.length,
      depData,
    })) as Promise<string> | void;

    if (typeof result === 'string') {
      await fs.writeFile(`${process.cwd()}/dependo.html`, result);
    }
  } catch (error) {
    throw new Error(error);
  }
}

export async function generateReport(path: string) {
  const file = await loadFile(path, FILE_MATCH);
  const dependencies = await loadDependencies(file);
  const aggregatedDependencies = await aggregateDependencyResults(dependencies);

  createReportFile(aggregatedDependencies);
}
