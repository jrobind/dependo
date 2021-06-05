import fetch from 'node-fetch';
import { Base64 } from 'js-base64';

import { ApiPackage } from '../interfaces/api';
import { API_URL } from '../config/constants';
import { GithubAPIRepoContent } from '../interfaces/shared';

export async function getPackageInformationLocally(
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

export async function getPackageInformationExternally(
  packageData: GithubAPIRepoContent,
): Promise<any> {
  try {
    const { owner, repo, path } = packageData;

    let data;
    const response = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/contents/${path}`,
    );

    if (response) {
      data = JSON.parse(Base64.decode((await response.json()).content));
    }

    return data;
  } catch (error) {
    throw new Error(error);
  }
}
