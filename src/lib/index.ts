import shell from 'shelljs';

import fs from 'fs/promises';
import * as Eta from 'eta';

import {
  FILE_MATCH,
  STYLES_PATH,
  API_URL,
  ETA_TEMPLATES,
  CURRENT_DIRECTORY,
  DependencyType,
} from '../config/constants';
import {
  getPackageInformationLocally,
  getPackageInformationExternally,
} from '../api';
import { ApiPackage } from '../interfaces/api';
import {
  PackageMeta,
  PackageInformation,
  TemplateDependecyData,
  GithubAPIRepoContent,
  CliOptions,
} from '../interfaces/shared';
import {
  constructQuery,
  refineInformation,
  splitDependenciesByType,
  extractRepoFileData,
} from '../utils';
import '../config';

export async function loadFile(
  path: string,
  fileMatch: typeof FILE_MATCH,
): Promise<string | undefined> {
  try {
    const files: string[] = await fs.readdir(path);
    const file = files.find(file => file === fileMatch);

    if (file) {
      return JSON.parse(await fs.readFile(file, 'binary'));
    }
  } catch (error) {
    throw new Error(error);
  }
}

export async function loadDependencies(data: any): Promise<PackageMeta[]> {
  try {
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
      dependencies.map(async dependency => {
        const packageInfo: ApiPackage = await getPackageInformationLocally(
          API_URL,
          constructQuery(dependency.name),
        );

        packageInfo.type = dependency.type as DependencyType; // add dependency type so we can split by type for template

        return packageInfo;
      }),
    );

    return refineInformation(packageInformation);
  } catch (error) {
    throw new Error(error);
  }
}

export async function createReportFile(
  data: PackageInformation[],
  out?: string,
) {
  try {
    const css = await fs.readFile(STYLES_PATH, 'binary');
    const depData: TemplateDependecyData = splitDependenciesByType(data);
    const result = (await Eta.renderFile(ETA_TEMPLATES, {
      css,
      totalDeps: depData.dependencies.length,
      totalDevDeps: depData.devDependencies.length,
      depData,
    })) as Promise<string> | void;

    if (out) {
      shell.mkdir('-p', out);
    }

    if (typeof result === 'string') {
      await fs.writeFile(`${out ? out : process.cwd()}/dependo.html`, result);
    }
  } catch (error) {
    throw new Error(error);
  }
}

export async function generateReport(options: CliOptions) {
  try {
    const { url, out } = options;
    let file;

    if (url) {
      const apiUrlData = extractRepoFileData(url) as GithubAPIRepoContent;
      file = await getPackageInformationExternally(apiUrlData);
    } else {
      file = await loadFile(CURRENT_DIRECTORY, FILE_MATCH);
    }

    const dependencies = await loadDependencies(file);
    const aggregatedDependencies = await aggregateDependencyResults(
      dependencies,
    );

    createReportFile(aggregatedDependencies, out);
  } catch (error) {
    throw new Error(error);
  }
}
