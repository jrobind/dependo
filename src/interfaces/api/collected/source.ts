export interface Source {
  files: Files;
}

interface Files {
  readmeSize: number;
  testsSize: number;
  hasChangelog: boolean;
  badges: Badges;
}

interface Badges {
  urls: object; // todo
  info: object; // todo
  linters: string[];
  coverage: number;
  outdatedDependencies: object; // todo
}
