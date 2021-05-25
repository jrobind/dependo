import { RangeData } from './metadata';

export interface Github {
  homepage: string;
  starsCount: number;
  forksCount: number;
  subscribersCount: number;
  issues: Issues;
  isDisabled: boolean;
  contributors: Contributors[];
  commits: RangeData[];
  statuses: Statuses[];
}

interface Issues {
  count: number;
  openCount: number;
  distribution: Distribution;
}

interface Distribution {
  [key: string]: number;
}

interface Contributors {
  username: string;
  commitsCount: number;
}

interface Statuses {
  context: string;
  state: string;
}
