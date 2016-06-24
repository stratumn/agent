'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = linkify;

var _superagent = require('superagent');

var _superagent2 = _interopRequireDefault(_superagent);

var _config = require('./config');

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function linkify(app, obj) {
  Object.keys(app.agentInfo.functions).filter(function (key) {
    return ['init', 'catchAll'].indexOf(key) < 0;
  }).forEach(function (key) {
    /*eslint-disable*/
    obj[key] = function () {
      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      return new Promise(function (resolve, reject) {
        var url = _config2.default.applicationUrl.replace('%s', app.name) + '/links/' + obj.meta.linkHash + '/' + key;
        /*eslint-enable*/

        return _superagent2.default.post(url).send(args).end(function (err, res) {
          if (err) {
            reject(err);
            return;
          }

          resolve(linkify(app, res.body));
        });
      });
    };
  });

  /*eslint-disable*/
  obj.getPrev = function () {
    /*eslint-enable*/
    if (obj.link.meta.prevLinkHash) {
      return app.getLink(obj.link.meta.prevLinkHash);
    }

    return Promise.resolve(null);
  };

  /*eslint-disable*/
  obj.getBranches = function (tags) {
    /*eslint-enable*/
    return app.getBranches(obj.meta.linkHash, tags);
  };

  /*eslint-disable*/
  obj.load = function () {
    /*eslint-enable*/
    return app.getLink(obj.meta.linkHash);
  };

  return obj;
}