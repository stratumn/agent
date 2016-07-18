import request from 'superagent';
import config from './config';
import createMap from './createMap';
import getLink from './getLink';
import getMap from './getMap';
import getBranches from './getBranches';

export default function getApplication(appName, appLocation) {
  return new Promise((resolve, reject) => {
    const url = appLocation || config.applicationUrl.replace('%s', appName);

    return request
      .get(url)
      .end((err, res) => {
        if (err) {
          reject(err);
          return;
        }

        const app = res.body;

        app.url = url;
        app.createMap = createMap.bind(null, app);
        app.getLink = getLink.bind(null, app);
        app.getMap = getMap.bind(null, app);
        app.getBranches = getBranches.bind(null, app);

        resolve(app);
      });
  });
}
