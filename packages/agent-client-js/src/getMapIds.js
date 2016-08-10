import request from 'superagent';
import makeQueryString from './makeQueryString';

export default function getMapIds(agent, opts = {}) {
  return new Promise((resolve, reject) => {
    const url = `${agent.url}/maps${makeQueryString(opts)}`;

    request
      .get(url)
      .end((err, res) => {
        if (err) {
          /*eslint-disable*/
          err.message = res && res.body.error ? res.body.error : err.message;
          err.status = res && res.statusCode;
          /*eslint-enable*/
          reject(err);
          return;
        }

        resolve(res.body);
      });
  });
}
