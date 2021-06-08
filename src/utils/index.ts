import millify from 'millify';
import {
  PackageInformation,
  TemplateDependecyData,
  GithubAPIRepoContent,
} from '../interfaces/shared';
import { ApiPackage } from '../interfaces/api';
import { DependencyType } from '../config/constants';

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

export function refineInformation(
  packages: Array<ApiPackage>,
): PackageInformation[] {
  return packages.map(
    ({
      collected: { metadata, github },
      evaluation: { popularity, maintenance },
      score: { detail },
      type,
    }) => ({
      name: metadata.name,
      description: metadata.description,
      homepage: metadata.links.homepage,
      githubStars: github?.starsCount
        ? millify(github?.starsCount)
        : 'Not available',
      repository: metadata.links.repository,
      npmHomepage: metadata.links.npm,
      downloadsCount: millify(+popularity.downloadsCount),
      maintenance,
      releasesFrequency: prettifyNormalisedScores(
        maintenance.releasesFrequency,
      ),
      maintenanceScore: prettifyNormalisedScores(detail.maintenance),
      type,
    }),
  );
}

export function splitDependenciesByType(
  dependencies: PackageInformation[],
): TemplateDependecyData {
  try {
    return dependencies.reduce(
      (accum, current) => {
        if (current.type === DependencyType.DEPENDENCY) {
          accum.dependencies.push(current);
        } else {
          accum.devDependencies.push(current);
        }

        return accum;
      },
      {
        dependencies: <PackageInformation[]>[],
        devDependencies: <PackageInformation[]>[],
      },
    );
  } catch (error) {
    throw new Error(error);
  }
}

export function prettifyNormalisedScores(score: number): number {
  const twoDecimalPlaces = +score.toFixed(2);

  return twoDecimalPlaces === 1
    ? Math.round(twoDecimalPlaces)
    : twoDecimalPlaces;
}

export function extractRepoFileData(url: string): GithubAPIRepoContent {
  // GitHub API get repo content https://docs.github.com/en/rest/reference/repos#get-repository-content
  const contents = url.replace('https://github.com/', '').split('/');

  return {
    owner: contents[0],
    repo: contents[1],
    path: contents[contents.length - 1],
  };
}
