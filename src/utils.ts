import fs from 'fs/promises';
import { FILE_MATCH } from './lib';

export interface PackageInformation {
  name: string;
  homepage: string;
  githubStars: number;
  popularity: number;
  score: number;
}

export interface DependencyNumbers {
  dependencies: number;
  devDependencies: number;
}

export function constructQuery(packageName: string): string {
  // @babel/core >> %40babel%2Fcore
  if (packageName.includes('@')) {
    const search = packageName
      .split('/')
      .map(item => (item.includes('@') ? item.slice(1) : item));

    return `%40${search.join('%2F')}`;
  }

  return packageName;
}

export function refineInformation(packages: Array<any>): PackageInformation[] {
  return packages.map(
    ({
      collected: { metadata, github },
      evaluation: { popularity },
      score,
    }) => ({
      name: metadata.name,
      homepage: metadata.homepage,
      githubStars: github?.starsCount,
      popularity,
      score,
    }),
  );
}

export async function getNumberOfDepenencies(
  path: string,
): Promise<DependencyNumbers> {
  try {
    const { dependencies, devDependencies } = JSON.parse(
      await fs.readFile(path, 'binary'),
    );

    return {
      dependencies: Object.keys(dependencies).length,
      devDependencies: Object.keys(devDependencies).length,
    };
  } catch (error) {
    throw new Error(error);
  }
}
