import request from 'superagent';
import config from './config';
import linkify from './linkify';

export default function createMap(app, ...args) {
  return new Promise((resolve, reject) => {
    const url = `${config.applicationUrl.replace('%s', app.name)}/maps`;

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
}
