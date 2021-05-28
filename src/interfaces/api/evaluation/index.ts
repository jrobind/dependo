export interface Evaluation {
  quality: Quality;
  popularity: Popularity;
  maintenance: Maintenance;
}

export interface Quality {
  carefulness: number;
  tests: number;
  health: number;
  branding: number;
}

export interface Popularity {
  communityInterest: number;
  downloadsCount: number | string;
  downloadsAcceleration: number;
  dependentsCount: number;
}

export interface Quality {
  carefulness: number;
  tests: number;
  health: number;
  branding: number;
}

export interface Maintenance {
  releasesFrequency: number;
  commitsFrequency: number;
  openIssues: number;
  issuesDistribution: number;
}
