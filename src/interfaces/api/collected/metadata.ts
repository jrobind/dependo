export interface MetaData {
  name: string;
  scope: string;
  version: string;
  description: string;
  keywords: string[];
  date: string;
  author: Author;
  publisher: Details;
  maintainers: Details[];
  repository: Repository;
  links: Links;
  license: string;
  devDependencies: DevDependencies;
  releases: RangeData[];
  readme: string;
}

interface Details {
  username: string;
  email: string;
}

interface Author extends Details {
  name: string;
  url: string;
}

interface Repository {
  type: string;
  url: string;
}

interface Links {
  npm: string;
  homepage: string;
  repository: string;
  bugs: string;
}

interface DevDependencies {
  [key: string]: string;
}

export interface RangeData {
  from: string;
  to: string;
  count: number;
}
