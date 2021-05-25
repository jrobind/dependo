// @ts-ignore
import mockApiPackage from '../__mocks__/api';
// @ts-ignore
import trimmedApiData from '../__mocks__/trimmed-api-data';

jest.mock('../src/api', () => ({
  getPackageInformation: jest.fn().mockImplementation(() => mockApiPackage),
}));

import {
  constructQuery,
  refineInformation,
  splitDependenciesByType,
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

    expect(processedPropLength).toEqual(8);
    expect(processedApiData.name).toEqual('testscript');
    // @ts-ignore
    expect(processedApiData.analyzedAt).toBe(undefined);
  });
});
