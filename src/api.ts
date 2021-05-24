import fetch from 'node-fetch';

import { API_URL } from './constants';

export async function getPackageInformation(
  url: typeof API_URL,
  packageName: string,
): Promise<any> {
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
