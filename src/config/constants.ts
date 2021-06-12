//  constants
export const API_URL = 'https://api.npms.io/v2/package/';
export const FILE_MATCH = 'package.json';
export const FILE_NAME = 'dependo';
export const CURRENT_DIRECTORY = process.cwd();
export const STYLES_PATH = `${CURRENT_DIRECTORY}/src/styles/style.css`;
export const ETA_TEMPLATES = `${CURRENT_DIRECTORY}/src/templates/template.eta`;

//  enums
export enum DependencyType {
  DEPENDENCY = 'DEPENDENCY',
  DEV_DEPENDENCY = 'DEV_DEPENDENCY',
}
