// @ts-ignore
import mockDependencies from '../__mocks__/dependencies';
// @ts-ignore
import mockApiPackage from '../__mocks__/api';

global.console = require('../__mocks__/console');

jest.mock('fs');
jest.mock('../src/api', () => ({
  getPackageInformation: jest.fn().mockImplementation(() => mockApiPackage),
}));

import mock from 'mock-fs';

import {
  constructQuery,
  refineInformation,
  getNumberOfDepenencies,
} from '../src/utils';

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

  it('Should construct correct search query', () => {
    const query1 = '@babel/core';
    const query2 = 'react';

    expect(constructQuery(query1)).toEqual('%40babel%2Fcore');
    expect(constructQuery(query2)).toEqual('react');
  });

  it('Should retrieve the correct number of dependencies and devDependencies', async () => {
    const path = `${process.cwd()}/test/package.json`;

    const result = await getNumberOfDepenencies(path);

    expect(result).toEqual({
      dependencies: 1,
      devDependencies: 5,
    });
  });

  it('Should process api package information', () => {
    const processedApiData = refineInformation([mockApiPackage])[0];
    const processedPropLength = Object.keys(processedApiData).length;

    expect(processedPropLength).toEqual(5);
    expect(processedApiData.name).toEqual('testscript');
    // @ts-ignore
    expect(processedApiData.analyzedAt).toBe(undefined);
  });
});
