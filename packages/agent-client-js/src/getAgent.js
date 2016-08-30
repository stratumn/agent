import createMap from './createMap';
import getSegment from './getSegment';
import findSegments from './findSegments';
import getMapIds from './getMapIds';
import { get } from './request';

// Deprecated.
import getBranches from './getBranches';
import getLink from './getLink';
import getMap from './getMap';

export default function getAgent(url) {
  return get(url)
    .then(res => {
      const agent = res.body;

      agent.url = url;
      agent.createMap = createMap.bind(null, agent);
      agent.getSegment = getSegment.bind(null, agent);
      agent.findSegments = findSegments.bind(null, agent);
      agent.getMapIds = getMapIds.bind(null, agent);

      // Deprecated.
      agent.getBranches = getBranches.bind(null, agent);
      agent.getLink = getLink.bind(null, agent);
      agent.getMap = getMap.bind(null, agent);

      return agent;
    });
}
