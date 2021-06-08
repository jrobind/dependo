import { Maintenance, Popularity } from './api/evaluation';
import { Score } from './api/score';

export interface PackageInformation {
  name: string;
  description: string;
  homepage: string;
  npmHomepage?: string;
  repository: string;
  githubStars?: string;
  downloadsCount: Popularity['downloadsCount'];
  maintenance: Maintenance;
  releasesFrequency: number;
  maintenanceScore: Score['detail']['maintenance'];
  type?: string;
}

export interface PackageMeta {
  name: string;
  type: string;
}

export interface TemplateDependecyData {
  dependencies: PackageInformation[];
  devDependencies: PackageInformation[];
}

export interface GithubAPIRepoContent {
  owner: string;
  repo: string;
  path: string;
}

export interface CliOptions {
  url?: string;
  out?: string;
}
