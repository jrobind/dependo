// @ts-ignore
import mockDependencies from '../__mocks__/dependencies';
// @ts-ignore
import mockApiPackage from '../__mocks__/api';
// @ts-ignore
import trimmedApiData from '../__mocks__/trimmed-api-data';

jest.mock('fs');
jest.mock('../src/api', () => ({
  getPackageInformation: jest.fn().mockImplementation(() => mockApiPackage),
}));

import mock from 'mock-fs';
import fs from 'fs/promises';
import {
  loadFile,
  loadDependencies,
  aggregateDependencyResults,
  FILE_MATCH,
} from '../src/lib';

const dependenciesList = [
  '@babel/cli',
  '@babel/core',
  'husky',
  'jest',
  'typescript',
  'node-fetch',
];

describe('main lib test suite', () => {
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

  it('Should aggregate dependency information results from API', async () => {
    const result = await aggregateDependencyResults(['testscript']);

    expect(result).toEqual(trimmedApiData);
  });
});
