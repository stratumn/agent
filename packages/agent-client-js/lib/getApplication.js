'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = getApplication;

var _superagent = require('superagent');

var _superagent2 = _interopRequireDefault(_superagent);

var _config = require('./config');

var _config2 = _interopRequireDefault(_config);

var _createMap = require('./createMap');

var _createMap2 = _interopRequireDefault(_createMap);

var _getLink = require('./getLink');

var _getLink2 = _interopRequireDefault(_getLink);

var _getMap = require('./getMap');

var _getMap2 = _interopRequireDefault(_getMap);

var _getBranches = require('./getBranches');

var _getBranches2 = _interopRequireDefault(_getBranches);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function getApplication(appName) {
  return new Promise(function (resolve, reject) {
    var url = _config2.default.applicationUrl.replace('%s', appName);

    return _superagent2.default.get(url).end(function (err, res) {
      if (err) {
        reject(err);
        return;
      }

      var app = res.body;

      app.url = url;
      app.createMap = _createMap2.default.bind(null, app);
      app.getLink = _getLink2.default.bind(null, app);
      app.getMap = _getMap2.default.bind(null, app);
      app.getBranches = _getBranches2.default.bind(null, app);

      resolve(app);
    });
  });
}