import request from 'superagent';
import segmentify from './segmentify';
import makeQueryString from './makeQueryString';

export default function findSegments(agent, opts = {}) {
  return new Promise((resolve, reject) => {
    const url = `${agent.url}/segments${makeQueryString(opts)}`;

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

        resolve(res.body.map(obj => segmentify(agent, obj)));
      });
  });
}
