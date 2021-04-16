"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.constructQuery = constructQuery;
exports.trimInformation = trimInformation;
exports.createDependencyFile = createDependencyFile;

var _promises = _interopRequireDefault(require("fs/promises"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function constructQuery(packageName) {
  // @babel/core >> %40babel%2Fcore
  if (packageName.includes('@')) {
    const search = packageName.split('/').map(item => {
      return item.includes('@') ? item.slice(1) : item;
    });
    return `%40${search.join('%2F')}`;
  } else {
    return packageName;
  }
}

function trimInformation(packages) {
  // collected.metadata, collected.github, evaluation.popularity, popularity.maintenance, score.final
  return packages.map(({
    collected: {
      metadata,
      github
    },
    evaluation: {
      popularity
    },
    score
  }) => {
    return {
      name: metadata.name,
      homepage: metadata.homepage,
      githubStars: github === null || github === void 0 ? void 0 : github.starsCount,
      popularity,
      score
    };
  });
}

async function createDependencyFile(data) {
  const response = data;
  await _promises.default.writeFile('dependo.json', response).catch(console.error);
}