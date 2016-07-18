import request from 'superagent';
import config from './config';

export default function linkify(app, obj) {
  Object
    .keys(app.agentInfo.functions)
    .filter(key => ['init', 'catchAll'].indexOf(key) < 0)
    .forEach(key => {
      /*eslint-disable*/
      obj[key] = (...args) =>
        new Promise((resolve, reject) => {
          const url = `${config.applicationUrl.replace('%s', app.name)}/links/${obj.meta.linkHash}/${key}`;
          /*eslint-enable*/

          return request
            .post(url)
            .send(args)
            .end((err, res) => {
              const error = err || (res.body.meta && res.body.meta.errorMessage);
              if (error) {
                reject(error);
                return;
              }

              resolve(linkify(app, res.body));
            });
        });
    });

  /*eslint-disable*/
  obj.getPrev = () => {
    /*eslint-enable*/
    if (obj.link.meta.prevLinkHash) {
      return app.getLink(obj.link.meta.prevLinkHash);
    }

    return Promise.resolve(null);
  };

  /*eslint-disable*/
  obj.getBranches = tags => {
    /*eslint-enable*/
    return app.getBranches(obj.meta.linkHash, tags);
  };

  /*eslint-disable*/
  obj.load = () => {
    /*eslint-enable*/
    return app.getLink(obj.meta.linkHash);
  };

  return obj;
}
