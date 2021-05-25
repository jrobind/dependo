import { Popularity } from './api/evaluation';
import { Score } from './api/score';

export interface PackageInformation {
  name: string;
  homepage: string;
  npmHomepage?: string;
  githubHomepage?: string;
  githubStars?: number;
  popularity: Popularity;
  score: Score;
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
