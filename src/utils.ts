import fs from 'fs/promises';

export interface PackageInformation {
  name: string;
  homepage: string;
  githubStars: number;
  popularity: number,
  score: number;
}

export function constructQuery(packageName: string): string {
  // @babel/core >> %40babel%2Fcore
  if (packageName.includes('@')) {
    const search = packageName.split('/').map((item) => { 
      return item.includes('@') ? item.slice(1) : item;
    });

    return `%40${search.join('%2F')}`;
  } else {
    return packageName
  }
}

export function trimInformation(packages: Array<any>): PackageInformation[] {
  return packages.map(({ collected: { metadata, github }, evaluation: { popularity }, score }) => {
    return {
      name: metadata.name,
      homepage: metadata.homepage,
      githubStars: github?.starsCount,
      popularity,
      score
    };
  });
}

export async function createDependencyFile(data: string) {
  try {
    const response = data;
    await fs.writeFile('dependo.json', response);

  } catch(error) {
    console.error(error);
  }
}

