import { Collected } from './collected';
import { Evaluation } from '../api/evaluation';
import { Score } from './score';

export interface ApiPackage {
  analyzedAt: string;
  collected: Collected;
  evaluation: Evaluation;
  error?: object; // todo
  score: Score;
  type?: string;
}
