import { PackageInformation, TemplateDependecyData } from './interfaces';
import { DependencyType } from './enums';

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
      type,
    }) => ({
      name: metadata.name,
      homepage: metadata.links.homepage,
      githubStars: github?.starsCount,
      popularity,
      score,
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
