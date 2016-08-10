import request from 'superagent';
import segmentify from './segmentify';

export default function getSegment(agent, linkHash) {
  return new Promise((resolve, reject) => {
    const url = `${agent.url}/segments/${linkHash}`;

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

        resolve(segmentify(agent, res.body));
      });
  });
}
