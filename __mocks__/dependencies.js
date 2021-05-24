export const packageMock = {
  name: 'test',
  homepage: 'https://someurl.com',
  dependencies: {
    'node-fetch': '^2.6.1',
  },
  devDependencies: {
    typescript: '^4.2.4',
    '@babel/cli': '^7.13.14',
    '@babel/core': '^7.13.15',
    husky: '^6.0.0',
    jest: '^26.6.3',
  },
};

export const dependenciesList = [
  { name: 'typescript', type: 'DEV_DEPENDENCY' },
  { name: 'node-fetch', type: 'DEPENDENCY' },
  { name: '@babel/cli', type: 'DEV_DEPENDENCY' },
  { name: '@babel/core', type: 'DEV_DEPENDENCY' },
  { name: 'husky', type: 'DEV_DEPENDENCY' },
  { name: 'jest', type: 'DEV_DEPENDENCY' },
];
