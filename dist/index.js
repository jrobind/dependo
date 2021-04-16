#!/usr/bin/env node
"use strict";

var _promises = _interopRequireDefault(require("fs/promises"));

var _api = require("./api");

var _utils = require("./utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const FILE_MATCH = 'package.json';
const CURRENT_DIRECTORY = process.cwd();

async function loadFile(path) {
  try {
    const files = await _promises.default.readdir(path);
    return files.filter(file => file === FILE_MATCH)[0];
  } catch (error) {
    console.error(`Failed to read ${error}`);
  }
}

async function loadDependencies(file) {
  try {
    const data = JSON.parse(await _promises.default.readFile(file, "binary"));
    return Object.keys({ ...data.devDependencies,
      ...data.dependencies
    });
  } catch (error) {
    console.error(`Failed to read ${error}`);
  }
}

async function aggregateDependencyResults(dependencies) {
  const packageInformation = await Promise.all(dependencies.map(async dependecy => {
    return await (0, _api.getPackageInformation)(_api.API_URL, (0, _utils.constructQuery)(dependecy));
  }));
  return JSON.stringify((0, _utils.trimInformation)(packageInformation));
}

async function generateReport(path) {
  const file = await loadFile(path);
  const dependencies = await loadDependencies(file);
  const aggregatedDependencies = await aggregateDependencyResults(dependencies);
  (0, _utils.createDependencyFile)(aggregatedDependencies);
}

generateReport(CURRENT_DIRECTORY);