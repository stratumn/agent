import getSegment from './getSegment';
import deprecated from './deprecated';

export default function getLink(agent, hash) {
  deprecated('Agent#getLink(agent, hash)', 'Agent#getSegment(agent, hash)');

  return getSegment(agent, hash);
}
