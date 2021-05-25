import fetch from 'node-fetch';

import { ApiPackage } from '../interfaces/api';
import { API_URL } from '../config/constants';

export async function getPackageInformation(
  url: typeof API_URL,
  packageName: string,
): Promise<ApiPackage> {
  try {
    let data;
    const response = await fetch(`${url}${packageName}`);

    if (response) {
      data = await response.json();
    }

    return data;
  } catch (error) {
    throw new Error(error);
  }
}
