import { RangeData } from './metadata';

export interface Npm {
  downloads: RangeData[];
  dependentsCount: number;
  starsCount: number;
  homepage?: string;
}
