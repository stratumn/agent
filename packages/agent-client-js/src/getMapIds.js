import request from 'superagent';
import makeQueryString from './makeQueryString';

export default function getMapIds(agent, opts = {}) {
  return new Promise((resolve, reject) => {
    const url = `${agent.url}/maps${makeQueryString(opts)}`;

    return request
      .get(url)
      .end((err, res) => {
        if (err) {
          reject(err);
          return;
        }

        resolve(res.body);
      });
  });
}
