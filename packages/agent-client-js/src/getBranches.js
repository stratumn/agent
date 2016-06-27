import request from 'superagent';
import config from './config';
import linkify from './linkify';

export default function getBranches(app, linkHash, tags = []) {
  return new Promise((resolve, reject) => {
    let query = '';

    if (tags && tags.length) {
      query = `?tags=${tags.join('&tags=')}`;
    }

    const url = `${config.applicationUrl.replace('%s', app.name)}/branches/${linkHash}${query}`;

    return request
      .get(url)
      .end((err, res) => {
        if (err) {
          reject(err);
          return;
        }

        resolve(res.body.map((link) => linkify(app, link)));
      });
  });
}
