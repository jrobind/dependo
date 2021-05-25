import { MetaData } from './metadata';
import { Npm } from './npm';
import { Github } from './github';
import { Source } from './source';

export interface Collected {
  metadata: MetaData;
  npm: Npm;
  github: Github;
  source: Source;
}
