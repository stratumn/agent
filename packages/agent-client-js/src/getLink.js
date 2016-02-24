import request from 'superagent';
import config from './config';
import linkify from './linkify';

export default function getLink(app, linkHash) {
  return new Promise((resolve, reject) => {
    const url = `${config.applicationUrl.replace('%s', app.name)}/links/${linkHash}`;

    return request
      .get(url)
      .end((err, res) => {
        if (err) {
          reject(err);
          return;
        }

        resolve(linkify(app, res.body));
      });
  });
}
