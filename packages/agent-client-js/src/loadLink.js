import request from 'superagent';
import linkify from './linkify';
import getApplication from './getApplication';

export default function loadLink(segment) {
  return getApplication(segment.meta.application, segment.meta.applicationLocation)
    .then((app) => {
      return new Promise((resolve, reject) => {
        const url = segment.meta.linkLocation;

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
    });
}
