// @ts-ignore
import mockDependencies from '../__mocks__/dependencies';
// @ts-ignore
import mockApiPackage from '../__mocks__/api';
// @ts-ignore
import trimmedApiData from '../__mocks__/trimmed-api-data';

global.console = require('../__mocks__/console');

jest.mock('fs');
jest.mock('../src/templates/template');
jest.mock('../src/api', () => ({
  getPackageInformation: jest.fn().mockImplementation(() => mockApiPackage),
}));

import myTemplate from '../src/templates/template';
import * as Eta from 'eta';
import * as Utils from '../src/utils';
import mock from 'mock-fs';
import fs from 'fs/promises';
import {
  loadFile,
  loadDependencies,
  aggregateDependencyResults,
  createReportFile,
  FILE_MATCH,
} from '../src/lib';
import { refineInformation } from '../src/utils';

const dependenciesList = [
  '@babel/cli',
  '@babel/core',
  'husky',
  'jest',
  'typescript',
  'node-fetch',
];

const numOfDependencies = {
  dependencies: Object.keys(mockDependencies.dependencies).length,
  devDependencies: Object.keys(mockDependencies.devDependencies).length,
};

describe('main test suite', () => {
  beforeAll(() => {
    mock({
      test: {
        'package.json': JSON.stringify(mockDependencies),
      },
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    mock.restore();
  });

  it('Should return a package.json file', async () => {
    fs.readdir = jest
      .fn()
      .mockResolvedValueOnce(['test.js', 'package.json', 'package-lock.json']);

    const file = await loadFile('/test', FILE_MATCH);

    expect(fs.readdir).toHaveBeenCalledTimes(1);
    expect(fs.readdir).toHaveBeenCalledWith('/test');
    expect(file).toEqual('package.json');
  });

  it('Should return correct dev-dependencies and dependencies', async () => {
    const file = `${process.cwd()}/test/package.json`;
    const dependencies = await loadDependencies(file);

    expect(dependencies).toEqual(dependenciesList);
  });

  it('Should write processed api package data to a .html file', async () => {
    const spyEta = jest.spyOn(Eta, 'render');
    const spyNumofDeps = jest.spyOn(Utils, 'getNumberOfDepenencies');
    spyEta.mockImplementation(() => myTemplate);
    (Utils.getNumberOfDepenencies as jest.Mock).mockReturnValueOnce(
      numOfDependencies,
    );

    fs.writeFile = jest.fn();

    const processedApiData = JSON.stringify(
      refineInformation([mockApiPackage]),
    );

    await createReportFile(processedApiData);
    expect(fs.writeFile).toHaveBeenCalledTimes(1);
    expect(Eta.render).toHaveBeenCalledTimes(1);
    expect(Eta.render).toHaveReturnedWith(myTemplate);
  });

  it('Should aggregate dependency information results from API', async () => {
    const result = await aggregateDependencyResults(['testscript']);

    expect(result).toEqual(trimmedApiData);
  });
});
