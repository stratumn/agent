import request from 'superagent';
import segmentify from './segmentify';

export default function getSegment(agent, linkHash) {
  return new Promise((resolve, reject) => {
    const url = `${agent.url}/segments/${linkHash}`;

    return request
      .get(url)
      .end((err, res) => {
        if (err) {
          reject(err);
          return;
        }

        resolve(segmentify(agent, res.body));
      });
  });
}
