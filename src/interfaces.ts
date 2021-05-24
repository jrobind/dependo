import { DependencyType } from './enums';

export interface PackageInformation {
  name: string;
  homepage: string;
  githubStars: number;
  popularity: number;
  score: number;
  type: DependencyType.DEPENDENCY | DependencyType.DEV_DEPENDENCY;
}

export interface PackageMeta {
  name: string;
  type: string;
}

export interface TemplateDependecyData {
  dependencies: PackageInformation[];
  devDependencies: PackageInformation[];
}
