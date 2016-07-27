import findSegments from './findSegments';
import deprecated from './deprecated';

export default function getBranches(agent, prevLinkHash, tags = []) {
  deprecated(
    'Agent#getBranches(agent, prevLinkHash, tags = [])',
    'Agent#findSegments(agent, filter)'
  );

  return findSegments(agent, { prevLinkHash, tags });
}
