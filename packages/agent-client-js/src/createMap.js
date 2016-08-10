import request from 'superagent';
import segmentify from './segmentify';

export default function createMap(agent, ...args) {
  return new Promise((resolve, reject) => {
    const url = `${agent.url}/segments`;

    request
      .post(url)
      .send(args)
      .end((err, res) => {
        const error = (res.body.meta && res.body.meta.errorMessage)
          ? new Error(res.body.meta.errorMessage)
          : err;

        if (error) {
          error.status = res && res.statusCode;
          reject(error);
          return;
        }

        resolve(segmentify(agent, res.body));
      });
  });
}
