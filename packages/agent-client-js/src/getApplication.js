import request from 'superagent';
import config from './config';
import createChain from './createChain';
import getLink from './getLink';

export default function getApplication(appName) {
  return new Promise((resolve, reject) => {
    const url = config.applicationUrl.replace('%s', appName);

    return request
      .get(url)
      .end((err, res) => {
        if (err) {
          reject(err);
          return;
        }

        const app = res.body;

        app.url = url;
        app.createChain = createChain.bind(null, app);
        app.getLink = getLink.bind(null, app);

        resolve(app);
      });
  });
}
