'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = getLink;

var _superagent = require('superagent');

var _superagent2 = _interopRequireDefault(_superagent);

var _config = require('./config');

var _config2 = _interopRequireDefault(_config);

var _linkify = require('./linkify');

var _linkify2 = _interopRequireDefault(_linkify);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function getLink(app, linkHash) {
  return new Promise(function (resolve, reject) {
    var url = _config2.default.applicationUrl.replace('%s', app.name) + '/links/' + linkHash;

    return _superagent2.default.get(url).end(function (err, res) {
      if (err) {
        reject(err);
        return;
      }

      resolve((0, _linkify2.default)(app, res.body));
    });
  });
}