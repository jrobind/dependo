// @ts-ignore
import { packageMock, dependenciesList } from '../__mocks__/dependencies';
// @ts-ignore
import mockApiPackage from '../__mocks__/api';
// @ts-ignore
import trimmedApiData from '../__mocks__/trimmed-api-data';

jest.mock('../src/config/constants', () => ({
  STYLES_PATH: `${process.cwd()}/styles/style.css`,
  FILE_MATCH: 'package.json',
  FILE_NAME: 'dependo',
  ETA_TEMPLATES: `${process.cwd()}/templates/template.eta`,
}));

global.console = require('../__mocks__/console');

jest.mock('../src/api', () => ({
  getPackageInformationLocally: jest
    .fn()
    .mockImplementation(() => mockApiPackage),
}));

import mock from 'mock-fs';
import fs from 'fs';
import {
  loadFile,
  loadDependencies,
  aggregateDependencyResults,
  createReportFile,
} from '../src/lib';
import { FILE_MATCH, FILE_NAME } from '../src/config/constants';
import { refineInformation } from '../src/utils';

describe('main test suite', () => {
  beforeAll(() => {
    mock({
      test: {
        'package.json': JSON.stringify(packageMock),
      },
      styles: {
        'style.css': 'body: { color: red }',
      },
      templates: {
        'template.eta': 'template',
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
    const fileContent = await loadFile(`${process.cwd()}/test/`, FILE_MATCH);

    expect(fileContent).toEqual(packageMock);
  });

  it('Should return correct dev-dependencies and dependencies', async () => {
    const dependencies = await loadDependencies(packageMock);

    expect(dependencies).toEqual(expect.arrayContaining(dependenciesList));
  });

  it('Should write processed api package data to a .html file', async () => {
    const processedApiData = refineInformation([mockApiPackage]);
    // no output dir specified
    await createReportFile(processedApiData);

    const fileNoOutput = await fs.promises.readFile(
      `${process.cwd()}/${FILE_NAME}.html`,
      'binary',
    );

    expect(fileNoOutput).toEqual('template');
    // output dir specified
    await createReportFile(processedApiData, `${process.cwd()}/tester`);

    const fileOutput = await fs.promises.readFile(
      `${process.cwd()}/tester/${FILE_NAME}.html`,
      'binary',
    );

    expect(fileOutput).toEqual('template');
  });

  it('Should aggregate dependency information results from API', async () => {
    const result = await aggregateDependencyResults([
      { name: 'testscript', type: 'DEPENDENCY' },
    ]);

    expect(result).toStrictEqual(trimmedApiData);
  });
});
