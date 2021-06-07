// @ts-ignore
import mockApiPackage from '../__mocks__/api';
// @ts-ignore
import trimmedApiData from '../__mocks__/trimmed-api-data';

jest.mock('../src/api', () => ({
  getPackageInformationLocally: jest
    .fn()
    .mockImplementation(() => mockApiPackage),
}));

import {
  constructQuery,
  refineInformation,
  splitDependenciesByType,
  prettifyNormalisedScores,
  extractRepoFileData,
} from '../src/utils';

describe('main test suite', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Should construct correct search query', () => {
    const query1 = '@babel/core';
    const query2 = 'react';

    expect(constructQuery(query1)).toEqual('%40babel%2Fcore');
    expect(constructQuery(query2)).toEqual('react');
  });

  it('should format normalised scores to two decimal places except integers', () => {
    expect(prettifyNormalisedScores(0.233)).toEqual(0.23);
    expect(prettifyNormalisedScores(0.957)).toEqual(0.96);
    expect(prettifyNormalisedScores(1)).toEqual(1);
  });

  it('Should split dependencies by type', async () => {
    const result = await splitDependenciesByType(trimmedApiData);

    expect(result).toEqual({
      dependencies: trimmedApiData,
      devDependencies: [],
    });
  });

  it('Should process api package information', () => {
    const processedApiData = refineInformation([mockApiPackage])[0];
    const processedPropLength = Object.keys(processedApiData).length;

    expect(processedPropLength).toEqual(11);
    expect(processedApiData.name).toEqual('testscript');
    // @ts-ignore
    expect(processedApiData.analyzedAt).toBe(undefined);
  });

  it('Should extract repo data from url for use with GitHub API', () => {
    const url = 'https://github.com/jrobind/soccer.js/blob/master/package.json';
    const result = extractRepoFileData(url);

    expect(result).toEqual({
      owner: 'jrobind',
      repo: 'soccer.js',
      path: 'package.json',
    });
  });
});
