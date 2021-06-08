// @ts-ignore
import { packageMock, dependenciesList } from '../__mocks__/dependencies';
// @ts-ignore
import mockApiPackage from '../__mocks__/api';
// @ts-ignore
import trimmedApiData from '../__mocks__/trimmed-api-data';

global.console = require('../__mocks__/console');

jest.mock('fs');
jest.mock('../src/api', () => ({
  getPackageInformationLocally: jest
    .fn()
    .mockImplementation(() => mockApiPackage),
}));

import * as Eta from 'eta';
import mock from 'mock-fs';
import fs from 'fs/promises';
import {
  loadFile,
  loadDependencies,
  aggregateDependencyResults,
  createReportFile,
} from '../src/lib';
import { FILE_MATCH } from '../src/config/constants';
import { refineInformation } from '../src/utils';

describe('main test suite', () => {
  beforeAll(() => {
    mock({
      test: {
        'package.json': JSON.stringify(packageMock),
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
    fs.readFile = jest
      .fn()
      .mockResolvedValueOnce(JSON.stringify('example file content'));

    const fileContent = await loadFile('/test', FILE_MATCH);

    expect(fs.readdir).toHaveBeenCalledTimes(1);
    expect(fs.readdir).toHaveBeenCalledWith('/test');
    expect(fileContent).toEqual('example file content');
  });

  it('Should return correct dev-dependencies and dependencies', async () => {
    const dependencies = await loadDependencies(packageMock);

    expect(dependencies).toEqual(expect.arrayContaining(dependenciesList));
  });

  it('Should write processed api package data to a .html file', async () => {
    const mockRenderFile = jest.spyOn(Eta, 'renderFile');
    mockRenderFile.mockReturnValue(Promise.resolve(''));
    fs.readFile = jest.fn();
    fs.writeFile = jest.fn();

    const processedApiData = refineInformation([mockApiPackage]);

    await createReportFile(processedApiData);

    expect(fs.readFile).toHaveBeenCalledTimes(1);
    expect(fs.writeFile).toHaveBeenCalledTimes(1);
    expect(Eta.renderFile).toHaveBeenCalledTimes(1);
  });

  it('Should aggregate dependency information results from API', async () => {
    const result = await aggregateDependencyResults([
      { name: 'testscript', type: 'DEPENDENCY' },
    ]);

    expect(result).toStrictEqual(trimmedApiData);
  });
});
