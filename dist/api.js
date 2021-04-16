"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getPackageInformation = getPackageInformation;
exports.API_URL = void 0;

var _nodeFetch = _interopRequireDefault(require("node-fetch"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const API_URL = 'https://api.npms.io/v2/package/';
exports.API_URL = API_URL;

async function getPackageInformation(url, packageName) {
  let deserialise;
  const response = await (0, _nodeFetch.default)(`${url}${packageName}`).catch(console.error);

  if (response) {
    deserialise = await response.json();
  }

  return deserialise;
}