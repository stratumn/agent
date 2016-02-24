import request from 'superagent';
import config from './config';
import linkify from './linkify';

export default function createChain(app, ...args) {
  return new Promise((resolve, reject) => {
    const url = `${config.applicationUrl.replace('%s', app.name)}/chains`;

    return request
      .post(url)
      .send(args)
      .end((err, res) => {
        if (err) {
          reject(err);
          return;
        }

        resolve(linkify(app, res.body));
      });
  });
}
