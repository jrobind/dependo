import { Github } from './api/collected/github';
import { Popularity } from './api/evaluation';
import { Score } from './api/score';

export interface PackageInformation {
  name: string;
  description: string;
  homepage: string;
  npmHomepage?: string;
  repository: string;
  githubStars?: string;
  downloadsCount: Popularity['downloadsCount'];
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
