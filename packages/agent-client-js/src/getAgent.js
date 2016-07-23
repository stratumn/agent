import request from 'superagent';
import createMap from './createMap';
import getSegment from './getSegment';
import findSegments from './findSegments';
import getMapIds from './getMapIds';

export default function getAgent(url) {
  return new Promise((resolve, reject) =>
    request
      .get(url)
      .end((err, res) => {
        if (err) {
          reject(err);
          return;
        }

        const agent = res.body;

        agent.url = url;
        agent.createMap = createMap.bind(null, agent);
        agent.getSegment = getSegment.bind(null, agent);
        agent.findSegments = findSegments.bind(null, agent);
        agent.getMapIds = getMapIds.bind(null, agent);

        resolve(agent);
      })
  );
}
