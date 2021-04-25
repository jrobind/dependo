// @ts-ignore
import mockApiPackage from '../__mocks__/api';
jest.mock('fs');

import fs from 'fs/promises';
import {
  constructQuery,
  trimInformation,
  createDependencyFile,
} from '../src/utils';

describe('Utils test suite', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Should construct correct search query', () => {
    const query1 = '@babel/core';
    const query2 = 'react';

    expect(constructQuery(query1)).toEqual('%40babel%2Fcore');
    expect(constructQuery(query2)).toEqual('react');
  });

  it('Should process api package information', () => {
    const processedApiData = trimInformation([mockApiPackage])[0];
    const processedPropLength = Object.keys(processedApiData).length;

    expect(processedPropLength).toEqual(5);
    expect(processedApiData.name).toEqual('testscript');
    // @ts-ignore
    expect(processedApiData.analyzedAt).toBe(undefined);
  });

  it('Should write processed api package data to a json file', async () => {
    fs.writeFile = jest.fn();
    const processedApiData = trimInformation([mockApiPackage]);

    await createDependencyFile(JSON.stringify(processedApiData));
    expect(fs.writeFile).toHaveBeenCalledTimes(1);
  });
});
