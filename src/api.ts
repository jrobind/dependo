import fetch from 'node-fetch';

export const API_URL = 'https://api.npms.io/v2/package/';

export async function getPackageInformation(
  url: typeof API_URL,
  packageName: string,
): Promise<string> {
  let deserialise;
  const response = await fetch(`${url}${packageName}`).catch(console.error);

  if (response) {
    deserialise = await response.json();
  }

  return deserialise;
}
